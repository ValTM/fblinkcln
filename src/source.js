const fbclid = 'fbclid';

class FbLinkCleaner {
  constructor() {
    window.fblnkcln = this;
    FbLinkCleaner.appendStyles();
    // Generate all components
    const mainDiv = FbLinkCleaner.newDiv('');
    mainDiv.id = 'fblnkcln';
    document.querySelector('body').appendChild(mainDiv);
    this.main = mainDiv;
    const headerDiv = this.createHeaderDiv();
    this.bodydiv = FbLinkCleaner.newDiv('body df bb');
    const footerDiv = this.createFooterDiv();
    this.main.append(headerDiv, this.bodydiv, footerDiv);
  }

  /**
   * Creates the footer div with all its elements
   * @returns {HTMLDivElement} the generated footer div
   */
  createFooterDiv() {
    const footerDiv = FbLinkCleaner.newDiv('footer df');
    this.settingsdiv = FbLinkCleaner.newDiv('settings df');
    this.settingsdiv.innerHTML = '<div><input type="checkbox">Auto-clean</div>'
      + '<div><input type="checkbox">Auto-open</div>'
      + '<div><input type="checkbox">Prevent dupes</div>';
    const clearAllDiv = FbLinkCleaner.newDiv('clearAll');
    this.clearbtn = FbLinkCleaner.newButton('btn clearallbtn', 'Clear all rows', 'Clear all', FbLinkCleaner.clearAllBtnFn);
    clearAllDiv.appendChild(this.clearbtn);
    footerDiv.append(this.settingsdiv, clearAllDiv);
    return footerDiv;
  }

  /**
   * Creates the header div with all its elements
   * @returns {HTMLDivElement} the generated header div
   */
  createHeaderDiv() {
    const headerDiv = FbLinkCleaner.newDiv('header df bb');
    const headerTitleDiv = FbLinkCleaner.newDiv('headerTitle');
    headerTitleDiv.innerText = 'Clean links';
    headerDiv.appendChild(headerTitleDiv);
    headerDiv.appendChild(FbLinkCleaner.newButton('btn closebtn', 'Close', 'X', FbLinkCleaner.closeBtnFn));
    this.setupDialogDrag(headerDiv);
    return headerDiv;
  }

  /**
   * Appends CSS style to the page
   */
  static appendStyles() {
    const css = document.createElement('style');
    const styles = '#fblnkcln {display:grid;grid-template-rows:1rem auto minmax(min-content, 1.1rem);overflow:auto;resize:both;padding:0;box-sizing:border-box;position:fixed;min-width:260px;min-heigh:100px;width:260px;height:200px;background:#23232d;z-index:999;transition: opacity .3s ease 0s, visibility .3s ease-in 0s;border:1px solid #e9e9e9}'
      + '#fblnkcln .df{display:flex}'
      + '#fblnkcln .bb{border-bottom:1px solid rgba(233,233,233,0.5)}'
      + '#fblnkcln .header{justify-content:space-between;cursor:move;background:#2c2c36}'
      + '#fblnkcln .headerTitle{padding:0 5px;color:tomato !important}'
      + '#fblnkcln .body{flex-direction:column;overflow:auto;scrollbar-color:tomato transparent;scrollbar-width:thin}'
      + '#fblnkcln .footer{flex-direction:column;margin-right:15px}'
      + '#fblnkcln input[type="checkbox"]{vertical-align:bottom}'
      + '#fblnkcln .clearAll{align-self:flex-end}'
      + '#fblnkcln .closebtn{border:none !important;padding:0 5px !important}'
      + '#fblnkcln .clearallbtn{padding:0 3px !important;visibility:hidden}'
      + '#fblnkcln .rowwrapper{background:#3b3b4b;justify-content:space-between}'
      + '#fblnkcln .rowwrapper:nth-child(2n){background:#2c2c46}'
      + '#fblnkcln .lnkwrapper{padding-left:5px;overflow:hidden;color:#f5f5f5 !important;align-items:center}'
      + '#fblnkcln .lnk{color:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
      + '#fblnkcln .btnwrapper{min-width:max-content}'
      + '#fblnkcln .btn{border:1px solid;padding:2px 5px;cursor:pointer;margin:1px;color:#fff;background:transparent;opacity:.8}';
    css.appendChild(document.createTextNode(styles));
    document.querySelector('head').appendChild(css);
  }

  /**
   * Gets the original link from the facebook A element when clicked with the scroll wheel
   * @param {MouseEvent} e
   */
  getOriginalLinkOnMiddleClick(e) {
    if (!this.dHidden && e.button === 1 && e.target.tagName === 'A') {
      e.preventDefault();
      const aHref = new URL(e.target.href);
      const uParam = aHref.searchParams.get('u');
      let origLink;
      if (uParam) {
        origLink = FbLinkCleaner.generateOrigLink(new URL(uParam));
      } else {
        origLink = FbLinkCleaner.generateOrigLink(aHref);
      }
      this.setupRow(origLink);
    }
  }

  /**
   * Cancels click event on middle click
   * @param {MouseEvent} e
   */
  cancelClickOnMiddleClick(e) {
    if (!this.dHidden && e.button === 1) {
      e.preventDefault();
    }
  }

  /**
   * Generates the original link from an URL object
   * @param {URL} url the URL to generate from
   * @returns {string} the original link without fbclid
   */
  static generateOrigLink(url) {
    let baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    if (url.search.lastIndexOf(fbclid) > 0) {
      baseUrl += `${url.search.substring(0, (url.search.lastIndexOf(fbclid) - 1))}`;
      return baseUrl;
    }
    const pn = url.pathname;
    if (pn.indexOf('photo.php') > 0) {
      return `${baseUrl}?fbid=${url.searchParams.get('fbid')}`;
    }
    if (pn.indexOf('profile.php') > 0) {
      return `${baseUrl}?id=${url.searchParams.get('id')}`;
    }
    if (pn.indexOf('mutual_friends') > 0) {
      return `${baseUrl}?uid=${url.searchParams.get('uid')}`;
    }
    console.log('No cleaning done, returning base URL');
    return baseUrl;
  }

  /**
   * Sets up a row for the current link
   * @param {string} href
   */
  setupRow(href) {
    const rowWrapper = FbLinkCleaner.newDiv('rowwrapper df');
    const linkWrapper = FbLinkCleaner.newDiv('lnkwrapper df');
    linkWrapper.appendChild(FbLinkCleaner.createLinkEl(href));
    const buttonsWrapper = FbLinkCleaner.newDiv('btnwrapper');
    const copyButton = FbLinkCleaner.newButton('btn', 'Copy to clipboard', 'COPY', FbLinkCleaner.getCopyLinkFn()
      .bind({
        href,
        mainDiv: this.main,
      }));
    const openButton = FbLinkCleaner.newButton('btn', 'Open in new tab', 'OPEN', FbLinkCleaner.getOpenLinkFn()
      .bind(href));
    const delButton = FbLinkCleaner.newButton('btn', 'Delete row', 'X', FbLinkCleaner.getDeleteRowFn()
      .bind({
        bodydiv: this.bodydiv,
        rowWrapper,
      }));
    buttonsWrapper.append(copyButton, openButton, delButton);
    rowWrapper.appendChild(linkWrapper);
    rowWrapper.appendChild(buttonsWrapper);
    this.bodydiv.appendChild(rowWrapper);
    rowWrapper.scrollIntoView();
    this.showClearAllBtn();
  }

  /*
   * BUTTON FUNCTIONS
   */

  showClearAllBtn() {
    this.clearbtn.style.visibility = 'visible';
  }

  hideClearAllBtn() {
    this.clearbtn.style.visibility = 'hidden';
  }

  /**
   * @private
   * Function for the close button to close the dialog
   */
  static closeBtnFn() {
    window.fblnkcln.hideDialog();
  }

  /**
   * @private
   * A function for the clear all button
   */
  static clearAllBtnFn() {
    const { bodydiv } = window.fblnkcln;
    while (bodydiv.firstChild) {
      bodydiv.removeChild(bodydiv.firstChild);
    }
    window.fblnkcln.hideClearAllBtn();
  }

  /**
   * Creats the function to copy the link to the clipboard
   * @returns {Function}
   */
  static getCopyLinkFn() {
    return function copyLinkFn() {
      let textArea;
      if (this.mainDiv.querySelector('textarea')) {
        textArea = this.mainDiv.querySelector('textarea');
      } else {
        textArea = document.createElement('textarea');
        textArea.style.cssText = 'opacity:0;width:0px;height:0px;margin:0;padding:0;border:none;box-sizing:border-box;';
        this.mainDiv.appendChild(textArea);
      }
      textArea.value = this.href;
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
    };
  }

  /**
   * Creates a function to open the link in a new tab
   * @returns {Function}
   */
  static getOpenLinkFn() {
    return function openLink() {
      window.open(this, '_blank');
    };
  }

  /**
   * Creates the function for deleting a row
   * @returns {Function}
   */
  static getDeleteRowFn() {
    return function deleteRow() {
      this.bodydiv.removeChild(this.rowWrapper);
      if (this.bodydiv.children.length === 0) {
        window.fblnkcln.hideClearAllBtn();
      }
    };
  }

  /*
   * END BUTTON FUNCTIONS
   */

  /**
   * Creates an A element with the href as link
   * @param {string} href href for the A element
   * @returns {HTMLAnchorElement} the created A element
   */
  static createLinkEl(href) {
    const link = document.createElement('a');
    link.href = href;
    link.innerText = href;
    link.className = 'lnk';
    link.target = '_blank';
    return link;
  }


  /**
   * Creates a button
   * @param {string} className class name of the button
   * @param {string} bTitle title of the button
   * @param {string} innerText inner text of the button
   * @param {Function} handler a function to execute on click
   * @returns {HTMLButtonElement} the created button
   */
  static newButton(className, bTitle, innerText, handler) {
    const button = document.createElement('button');
    button.className = className;
    button.title = bTitle;
    button.innerText = innerText;
    button.onclick = handler;
    return button;
  }

  /**
   * Creates a new div with a class name
   * @param {string} className the class name
   * @returns {HTMLDivElement} the created div
   */
  static newDiv(className) {
    const div = document.createElement('div');
    div.className = className;
    return div;
  }

  /**
   * Sets up the dialog draging capabilites
   * @param {HTMLElement} headerDiv an element to be the drag-enabled one
   */
  setupDialogDrag(headerDiv) {
    this.vpH = document.documentElement.clientHeight;
    this.vpW = document.documentElement.clientWidth;
    window.addEventListener('resize', () => {
      this.vpH = document.documentElement.clientHeight;
      this.vpW = document.documentElement.clientWidth;
      this.setDialogPositionAfterWindowResize();
    });
    const mainDiv = this.main;
    let newX;
    let newY;
    let currentX;
    let currentY;
    const mainDivHeight = mainDiv.offsetHeight;
    const mainDivWidth = mainDiv.offsetWidth;
    // eslint-disable-next-line no-param-reassign
    headerDiv.onmousedown = (e) => {
      e.preventDefault();
      // get the mouse cursor position at startup:
      currentX = e.clientX;
      currentY = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      // call a function whenever the cursor moves:
      document.onmousemove = (e2) => {
        e2.preventDefault();
        // calculate the new cursor position:
        newX = currentX - e2.clientX;
        newY = currentY - e2.clientY;
        currentX = e2.clientX;
        currentY = e2.clientY;
        // set the element's new position:
        const newYPos = mainDiv.offsetTop - newY;
        const newXPos = mainDiv.offsetLeft - newX;
        this.setDialogOffset(newYPos, mainDivHeight, this.vpH, 'top');
        this.setDialogOffset(newXPos, mainDivWidth, this.vpW, 'left');
      };
    };
  }

  /**
   * Moves the dialog in visible space after viewport resize
   */
  setDialogPositionAfterWindowResize() {
    if (this.main.getBoundingClientRect().top + this.main.offsetHeight > this.vpH) {
      const newTop = this.vpH - this.main.offsetHeight;
      this.main.style.top = `${newTop > 0 ? newTop : 0}`;
    }
    if (this.main.getBoundingClientRect().left + this.main.offsetWidth > this.vpW) {
      const newLeft = this.vpW - this.main.offsetWidth;
      this.main.style.left = `${newLeft > 0 ? newLeft : 0}`;
    }
  }

  /**
   * Bounds checking
   * @param newPos new X or Y position
   * @param mainDivPosAttribute mainDivHeight or Width
   * @param viewPortAttribute vpH or Width
   * @param offset top or left
   */
  setDialogOffset(newPos, mainDivPosAttribute, viewPortAttribute, offset) {
    let newValue;
    if (newPos >= 0) {
      if ((mainDivPosAttribute + newPos) <= viewPortAttribute) {
        newValue = `${newPos}px`;
      } else {
        newValue = `${viewPortAttribute - mainDivPosAttribute}px`;
      }
    } else {
      newValue = '0px';
    }
    if (offset === 'top') {
      this.main.style.top = newValue;
    } else {
      this.main.style.left = newValue;
    }
  }

  /**
   * Hide the dialog and unreginster event listeners
   */
  hideDialog() {
    this.dHidden = true;
    this.main.style.visibility = 'hidden';
    this.main.style.opacity = '0';
  }

  /**
   * Show and reset dialog and re-register event listeners
   */
  showDialog() {
    this.dHidden = false;
    const mainDivStyle = this.main.style;
    mainDivStyle.visibility = 'visible';
    mainDivStyle.opacity = '1';
    mainDivStyle.top = '0';
    mainDivStyle.left = '0';
    if (!this.eventsRegistered) this.registerEventListeners();
  }

  /**
   * Registers event listeners for mousedown and click
   */
  registerEventListeners() {
    document.addEventListener('mousedown', this.getOriginalLinkOnMiddleClick.bind(this));
    document.addEventListener('click', this.cancelClickOnMiddleClick);
    this.eventsRegistered = true;
  }
}

if (window.location.hostname === 'www.facebook.com') {
  (window.fblnkcln || new FbLinkCleaner()).showDialog();
} else {
  // eslint-disable-next-line no-alert
  alert('Only www.facebook.com is supported!');
}
