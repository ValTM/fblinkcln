const fbclid = 'fbclid';

class FbLinkCleaner {
  constructor() {
    window.fblnkcln = this;
    FbLinkCleaner.appendStyles();
    // Generate all components
    const mainDiv = FbLinkCleaner.newDiv('fblnkclnmaindiv');
    mainDiv.id = 'fblnkclnid';
    document.querySelector('body').appendChild(mainDiv);
    this.main = mainDiv;
    const headerDiv = FbLinkCleaner.newDiv('header');
    headerDiv.appendChild(FbLinkCleaner.newButton('btn closebtn', 'Close', 'X', FbLinkCleaner.closeBtnFn));
    this.setupDialogDrag(headerDiv);
    const bodyDiv = FbLinkCleaner.newDiv('body');
    this.bodydiv = bodyDiv;
    const footerDiv = FbLinkCleaner.newDiv('footer');
    this.clearbtn = FbLinkCleaner.newButton('btn clearallbtn', 'Clear all rows', 'Clear all', FbLinkCleaner.clearAllBtnFn);
    footerDiv.appendChild(this.clearbtn);
    this.main.append(headerDiv, bodyDiv, footerDiv);
  }

  /**
   * Appends CSS style to the page
   */
  static appendStyles() {
    const css = document.createElement('style');
    let styles = '#fblnkclnid {resize:both;overflow:auto;padding:0;box-sizing:border-box;position:fixed;width:250px;height:200px;top:0;left:0;background:#23232d;z-index:1000000;display:flex;flex-direction:column;visibility:visible;opacity:.7;transition: opacity .3s ease 0s, visibility .3s ease-in 0s;border:1px solid #e9e9e9}';
    styles += '#fblnkclnid .header{flex:0 1 auto;display:flex;justify-content:flex-end;cursor:move;background:#2c2c36}';
    styles += '#fblnkclnid .body{flex:1 1 auto;display:flex;flex-direction:column;overflow:auto}';
    styles += '#fblnkclnid .footer{flex:0 1 20px;display:flex;justify-content:flex-end;margin-right:15px;min-height:20px}';
    styles += '#fblnkclnid .closebtn{border:none !important;padding:0 5px !important}';
    styles += '#fblnkclnid .clearallbtn{padding:0 3px !important;visibility:hidden}';
    styles += '#fblnkclnid .rowwrapper{background:#3b3b4b;display:flex;justify-content:space-between}';
    styles += '#fblnkclnid .rowwrapper:nth-child(2n){background:#2c2c46}';
    styles += '#fblnkclnid .btnwrapper{min-width:max-content}';
    styles += '#fblnkclnid .lnkwrapper{padding-left:5px;overflow:hidden;color:#f5f5f5 !important;display:flex;align-items:center}';
    styles += '#fblnkclnid .lnk{color:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}';
    styles += '#fblnkclnid .btn{border:1px solid;padding:2px 5px;cursor:pointer;margin:1px;color:#fff;background:transparent;opacity:.8}';
    css.appendChild(document.createTextNode(styles));
    document.querySelector('head').appendChild(css);
  }

  /**
   * Gets the original link from the facebook A element when clicked with the scroll wheel
   * @param {MouseEvent} e
   */
  getOriginalLinkOnMiddleClick(e) {
    if (e.button === 1 && e.target.tagName === 'A') {
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
  static cancelClickOnMiddleClick(e) {
    if (e.button === 1) {
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
    const rowWrapper = FbLinkCleaner.newDiv('rowwrapper');
    const linkWrapper = FbLinkCleaner.newDiv('lnkwrapper');
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
    this.main.style.visibility = 'hidden';
    this.main.style.opacity = '0';
    this.unregisterEventListeners();
  }

  /**
   * Show and reset dialog and re-register event listeners
   */
  showDialog() {
    const mainDivStyle = this.main.style;
    mainDivStyle.visibility = 'visible';
    mainDivStyle.opacity = '1';
    mainDivStyle.top = '0';
    mainDivStyle.left = '0';
    this.registerEventListeners();
  }

  /**
   * Registers event listeners for mousedown and click
   */
  registerEventListeners() {
    document.addEventListener('mousedown', this.getOriginalLinkOnMiddleClick.bind(this));
    document.addEventListener('click', FbLinkCleaner.cancelClickOnMiddleClick);
  }

  /**
   * Unregisters event listeners for mousedown and click
   */
  unregisterEventListeners() {
    document.removeEventListener('mousedown', this.getOriginalLinkOnMiddleClick.bind(this));
    document.removeEventListener('click', FbLinkCleaner.cancelClickOnMiddleClick);
  }
}

if (window.location.hostname === 'www.facebook.com') {
  (window.fblnkcln || new FbLinkCleaner()).showDialog();
} else {
  // eslint-disable-next-line no-alert
  alert('Only www.facebook.com is supported!');
}
