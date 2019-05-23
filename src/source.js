const fbclid = 'fbclid';

class FbLinkCleaner {
  constructor() {
    window.fblnkcln = this;
    // Generate all components
    this.main = FbLinkCleaner.setupMainDiv();
    const headerDiv = FbLinkCleaner.setupHeaderDiv();
    this.setupDialogDrag(headerDiv);
    const bodyDiv = this.setupBodyDiv();
    const footerDiv = FbLinkCleaner.setupFooterDiv();
    const clearAllBtn = this.setupClearAllBtn();
    footerDiv.appendChild(clearAllBtn);
    this.main.append(headerDiv, bodyDiv, footerDiv);
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
    if (url.search.lastIndexOf(fbclid) > 0) {
      baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      baseUrl += `${url.search.substring(0, (url.search.lastIndexOf(fbclid) - 1))}`;
    }
    return baseUrl;
  }

  /**
   * Sets up a row for the current link
   * @param {string} href
   */
  setupRow(href) {
    const rowWrapper = FbLinkCleaner.createRowWrapper();
    const linkWrapper = FbLinkCleaner.createLinkWrapper(href);
    const buttonsWrapper = FbLinkCleaner.createButtonsWrapper();
    const copyButton = FbLinkCleaner.createRowButton('Copy to clipboard', 'COPY', FbLinkCleaner.getCopyLinkFn()
      .bind({
        href,
        mainDiv: this.main,
      }));
    const openButton = FbLinkCleaner.createRowButton('Open in new tab', 'OPEN', FbLinkCleaner.getOpenLinkFn()
      .bind(href));
    const delButton = FbLinkCleaner.createRowButton('Delete row', 'X', FbLinkCleaner.getDeleteRowFn()
      .bind({
        bodydiv: this.bodydiv,
        rowWrapper,
      }));
    buttonsWrapper.append(copyButton, openButton, delButton);
    rowWrapper.appendChild(linkWrapper);
    rowWrapper.appendChild(buttonsWrapper);
    this.bodydiv.appendChild(rowWrapper);
  }

  /*
   * BUTTON FUNCTIONS
   */

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
    };
  }

  /*
   * END BUTTON FUNCTIONS
   */

  /*
  * ROW ELEMENTS HTML
  */

  /**
   * Creates a button wrapper div
   * @returns {HTMLDivElement}
   */
  static createButtonsWrapper() {
    const buttonsWrapper = document.createElement('div');
    buttonsWrapper.style.cssText = 'min-width:max-content';
    return buttonsWrapper;
  }

  /**
   * Creates a whole row wrapper div
   * @returns {HTMLDivElement}
   */
  static createRowWrapper() {
    const rowWrapper = document.createElement('div');
    rowWrapper.style.cssText = 'background:aquamarine;display:flex;justify-content:space-between';
    return rowWrapper;
  }

  /**
   * Creates a link wrapper div
   * @returns {HTMLDivElement}
   */
  static createLinkWrapper(href) {
    const linkWrapper = document.createElement('div');
    linkWrapper.style.cssText = 'padding-left:5px;overflow:hidden;color:black !important;display:flex;align-items:center';
    linkWrapper.appendChild(FbLinkCleaner.createLink(href));
    return linkWrapper;
  }

  /**
   * Creates an A element with the href as link
   * @param {string} href href for the A element
   * @returns {HTMLAnchorElement} the created A element
   */
  static createLink(href) {
    const link = document.createElement('a');
    link.href = href;
    link.innerText = href;
    link.style.cssText = 'color:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
    link.target = '_blank';
    return link;
  }

  /**
   * Creates a row button
   * @param {string} bTitle title of the button
   * @param {string} innerText inner text of the button
   * @param {Function} handler a function to execute on click
   * @returns {HTMLButtonElement} the created button
   */
  static createRowButton(bTitle, innerText, handler) {
    const button = document.createElement('button');
    button.style.cssText = 'border:1px solid;padding:2px 5px;cursor:pointer;margin:1px';
    button.title = bTitle;
    button.innerText = innerText;
    button.onclick = handler;
    return button;
  }

  /*
  * END ROW ELEMENTS HTML
  */

  /*
  * MAIN HTML ELEMENTS
  */

  /**
   * Creates the footer div
   * @returns {HTMLDivElement}
   */
  static setupFooterDiv() {
    const footerDiv = document.createElement('div');
    footerDiv.style.cssText = 'flex:0 1 20px;display:flex;justify-content:flex-end;margin-right:12px;min-height:20px;';
    return footerDiv;
  }

  /**
   * Creates the body div
   * @returns {HTMLDivElement}
   */
  setupBodyDiv() {
    const bodyDiv = document.createElement('div');
    bodyDiv.style.cssText = 'flex:1 1 auto;display:flex;flex-direction:column;overflow:auto';
    this.bodydiv = bodyDiv;
    return bodyDiv;
  }

  /**
   * Creates the header div
   * @returns {HTMLDivElement}
   */
  static setupHeaderDiv() {
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = ' flex:0 1 auto;display:flex;justify-content:flex-end;cursor:move;background-color:rgb(44,44,54)';
    headerDiv.appendChild(FbLinkCleaner.setupCloseBtn());
    return headerDiv;
  }

  /**
   * Creates the close button for the dialog
   * @returns {HTMLButtonElement}
   */
  static setupCloseBtn() {
    const closeBtn = document.createElement('button');
    closeBtn.style.all = 'unset';
    closeBtn.title = 'Close';
    closeBtn.style.cssText = 'border:none;padding:0 5px;background:none;cursor:pointer;color:rgb(233,233,233);';
    closeBtn.innerText = 'X';
    closeBtn.onclick = () => {
      window.fblnkcln.hideDialog();
    };
    return closeBtn;
  }

  /**
   * Creates the main div for the dialog
   * @returns {HTMLDivElement}
   */
  static setupMainDiv() {
    const mainDiv = document.createElement('div');
    mainDiv.style.cssText = 'resize:both;overflow:auto;padding:0px;box-sizing:border-box;position:fixed;width:250px;height:200px;top:0;left:0;background-color:rgb(35,35,45);z-index:1000000;display:flex;flex-direction:column;visibility:visible;opacity:0.7;transition: opacity 0.3s ease 0s, visibility 0.3s ease-in 0s;border:1px solid rgb(233,233,233);';
    mainDiv.id = 'fblnkclnid';
    document.querySelector('body')
      .appendChild(mainDiv);
    return mainDiv;
  }

  setupClearAllBtn() {
    const button = document.createElement('button');
    button.style.cssText = 'padding:0 3px;border:1px solid;cursor:pointer';
    button.title = 'Clear all rows';
    button.innerText = 'Clear all';
    button.onclick = () => {
      while (this.bodydiv.firstChild) {
        this.bodydiv.removeChild(this.bodydiv.firstChild);
      }
    };
    return button;
  }

  /*
  * END MAIN HTML ELEMENTS
  */

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
