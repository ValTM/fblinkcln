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
    this.settingsDiv = FbLinkCleaner.newDiv('dn');
    this.settingsDiv.innerHTML = '<div><input type="checkbox">Auto-clean</div>'
      + '<div><input type="checkbox">Auto-open</div>'
      + '<div><input type="checkbox">Prevent dupes</div>';
    const clearAllDiv = FbLinkCleaner.newDiv('df jcsb');
    const footerSettingsCont = FbLinkCleaner.newDiv('df');
    const unknownParamsDiv = FbLinkCleaner.newDiv('df upDiv');
    const tooltipSpan = document.createElement('span');
    tooltipSpan.className = 'tooltip';
    tooltipSpan.innerText = 'Unknown params! Check the console';
    this.unknownParamsNumberDiv = FbLinkCleaner.newDiv('');
    this.unknownParamsNumberDiv.innerText = '0';
    unknownParamsDiv.append(this.unknownParamsNumberDiv, tooltipSpan);
    const settingsIconDiv = FbLinkCleaner.newDiv('setI');
    settingsIconDiv.onclick = () => {
      const div = window.fblnkcln.settingsDiv;
      // eslint-disable-next-line no-unused-expressions
      div.classList.contains('dn') ? div.className = 'df' : div.className = 'dn';
    };
    settingsIconDiv.innerHTML = '<svg class="svg-icon df" viewBox="0 0 20 20"><path d="M6.176,7.241V6.78c0-0.221-0.181-0.402-0.402-0.402c-0.221,0-0.403,0.181-0.403,0.402v0.461C4.79,7.416,4.365,7.955,4.365,8.591c0,0.636,0.424,1.175,1.006,1.35v3.278c0,0.222,0.182,0.402,0.403,0.402c0.222,0,0.402-0.181,0.402-0.402V9.941c0.582-0.175,1.006-0.714,1.006-1.35C7.183,7.955,6.758,7.416,6.176,7.241 M5.774,9.195c-0.332,0-0.604-0.272-0.604-0.604c0-0.332,0.272-0.604,0.604-0.604c0.332,0,0.604,0.272,0.604,0.604C6.377,8.923,6.105,9.195,5.774,9.195 M10.402,10.058V6.78c0-0.221-0.181-0.402-0.402-0.402c-0.222,0-0.402,0.181-0.402,0.402v3.278c-0.582,0.175-1.006,0.714-1.006,1.35c0,0.637,0.424,1.175,1.006,1.351v0.461c0,0.222,0.181,0.402,0.402,0.402c0.221,0,0.402-0.181,0.402-0.402v-0.461c0.582-0.176,1.006-0.714,1.006-1.351C11.408,10.772,10.984,10.233,10.402,10.058M10,12.013c-0.333,0-0.604-0.272-0.604-0.604S9.667,10.805,10,10.805c0.332,0,0.604,0.271,0.604,0.604S10.332,12.013,10,12.013M14.629,8.448V6.78c0-0.221-0.182-0.402-0.403-0.402c-0.221,0-0.402,0.181-0.402,0.402v1.668c-0.581,0.175-1.006,0.714-1.006,1.35c0,0.636,0.425,1.176,1.006,1.351v2.07c0,0.222,0.182,0.402,0.402,0.402c0.222,0,0.403-0.181,0.403-0.402v-2.07c0.581-0.175,1.006-0.715,1.006-1.351C15.635,9.163,15.21,8.624,14.629,8.448 M14.226,10.402c-0.331,0-0.604-0.272-0.604-0.604c0-0.332,0.272-0.604,0.604-0.604c0.332,0,0.604,0.272,0.604,0.604C14.83,10.13,14.558,10.402,14.226,10.402 M17.647,3.962H2.353c-0.221,0-0.402,0.181-0.402,0.402v11.27c0,0.222,0.181,0.402,0.402,0.402h15.295c0.222,0,0.402-0.181,0.402-0.402V4.365C18.05,4.144,17.869,3.962,17.647,3.962 M17.245,15.232H2.755V4.768h14.49V15.232z"></path></svg>';
    this.clearbtn = FbLinkCleaner.newButton('btn clearallbtn', 'Clear all rows', 'Clear all', FbLinkCleaner.clearAllBtnFn);
    footerSettingsCont.append(settingsIconDiv, unknownParamsDiv);
    clearAllDiv.append(footerSettingsCont, this.clearbtn);
    footerDiv.append(this.settingsDiv, clearAllDiv);
    return footerDiv;
  }

  /**
   * Creates the header div with all its elements
   * @returns {HTMLDivElement} the generated header div
   */
  createHeaderDiv() {
    const headerDiv = FbLinkCleaner.newDiv('header df bb jcsb');
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
      + '#fblnkcln .dn{display:none}'
      + '#fblnkcln .bb{border-bottom:1px solid rgba(233,233,233,0.5)}'
      + '#fblnkcln .jcsb{justify-content:space-between}'
      + '#fblnkcln input[type="checkbox"]{vertical-align:bottom}'
      + '#fblnkcln .svg-icon{height:20px;width:20px}#fblnkcln .svg-icon path,#fblnkcln .svg-icon polygon,#fblnkcln .svg-icon rect{fill:rgba(233,233,233,0.5)}#fblnkcln .svg-icon circle{stroke:#4691f6;stroke-width:1}'
      + '#fblnkcln .header{cursor:move;background:#2c2c36}'
      + '#fblnkcln .headerTitle{padding:0 5px;color:tomato !important}'
      + '#fblnkcln .body{flex-direction:column;overflow:auto;scrollbar-color:tomato transparent;scrollbar-width:thin}'
      + '#fblnkcln .footer{flex-direction:column;margin-right:15px}'
      + '#fblnkcln .upDiv{-moz-user-select:none;user-select:none;display:none;color:rgba(255,255,0,0.7)!important;font-size:0.6rem;border:1px solid rgba(255,255,0,0.6);box-sizing:border-box;border-radius:1rem;width:1rem;justify-content:center;align-items:center;margin:2px}'
      + '#fblnkcln .upDiv .tooltip{visibility:hidden;opacity:0;width:190px;background-color:rgb(53,53,53);text-align:center;padding:3px 0;position:absolute;z-index:301;left:45px;border-radius:4px;transition:opacity 0.6s}'
      + '#fblnkcln .upDiv .tooltip::after{content:"";position:absolute;top:50%;right:100%;margin-top:-5px;border-width:5px;border-style:solid;border-color:transparent rgb(53,53,53) transparent transparent}'
      + '#fblnkcln .upDiv:hover .tooltip{visibility:visible;opacity:1}'
      + '#fblnkcln .setI:hover{background-color:rgba(233,233,233,0.2)}'
      + '#fblnkcln .setI:active{background-color:rgba(180,180,180,0.2)}'
      + '#fblnkcln .closebtn{border:none !important;padding:0 5px !important}'
      + '#fblnkcln .clearallbtn{padding:0 3px !important;visibility:hidden}'
      + '#fblnkcln .rowwrapper{background:#3b3b4b}'
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
    if (!this.dHidden && e.button === 1) {
      FbLinkCleaner.stopEvent(e);
      try {
        if (e.target.tagName === 'A') {
          this.setupRow(FbLinkCleaner.getOrigLinkFromHTMLLinkElement(e.target));
        } else if (e.target.tagName === 'SPAN') {
          const span = e.target;
          if (span.parentElement.tagName === 'ABBR' || span.parentElement.tagName === 'DIV') {
            if (span.parentElement.parentElement.tagName === 'A') {
              this.setupRow(FbLinkCleaner
                .getOrigLinkFromHTMLLinkElement(span.parentElement.parentElement));
            } else {
              throw new Error('Unsupported');
            }
          } else {
            throw new Error('Unsupported');
          }
        } else {
          throw new Error('Unsupported');
        }
      } catch (err) {
        console.error(err);
        console.log(err.target);
      }
    }
  }

  /**
   * Gets the original link from a link element
   * @param {HTMLLinkElement} element the link element
   * @returns {string} the generated original link
   */
  static getOrigLinkFromHTMLLinkElement(element) {
    const aHref = new URL(element.href);
    const uParam = aHref.searchParams.get('u');
    let origLink;
    if (uParam) {
      origLink = FbLinkCleaner.generateOrigLinkFromUrl(new URL(uParam));
    } else {
      origLink = FbLinkCleaner.generateOrigLinkFromUrl(aHref);
    }
    return origLink;
  }

  /**
   * Generates the original link from an URL object
   * @param {URL} url the URL to generate from
   * @returns {string} the original link without fbclid
   */
  static generateOrigLinkFromUrl(url) {
    let baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    if (url.search.lastIndexOf(fbclid) > 0) {
      baseUrl += `${url.search.substring(0, (url.search.lastIndexOf(fbclid) - 1))}`;
      return baseUrl;
    }
    const wl = ['act', 'app_id', 'av', 'campaign_id', 'category', 'crisis_id', 'dialog_type', 'faq', 'fbid', 'filter_set', 'force-refresh', 'id', 'is_monthly_subscription', 'launch_creation', 'loc', 'locale', 'modal', 'page', 'page_id', 's', 'section', 'set', 'sk', 'tab', 'tag', 'type', 'uid', 'view'];
    const wle = ['suggestion_token'];
    const bl = ['__tn__', '__xts__', 'acontext', 'action_history', 'comment_tracking', 'cref', 'discovery_session_id', 'donate_ref', 'eid', 'entry_point', 'epa', 'external_ref', 'extra_1', 'fbclid', 'fbsource', 'feedback_referrer', 'feedback_source', 'fref', 'from', 'from_bookmark', 'ft_ent_identifier', 'group_sell_ref', 'hc_location', 'hc_ref', 'href', 'listing_type', 'log_filter', 'ls_ref', 'lst', 'offerx_bypass_snowlift', 'offerx_id', 'offerx_referrer', 'orig_src', 'p[0]', 'par', 'parent_fbid', 'placement', 'player_origin', 'privacy_source', 'redirected_for_ios', 'redirect_to_gameroom', 'ref', 'ref_mechanism', 'ref_surface', 'referrer_id', 'referrer_profile_id', 'referrer_type', 'share_source', 'source', 'source_data', 'source_data%5Bsource_id%5D', 'source_data%5Bsource_name%5D', 'source_id', 'source_ref', 'spotlight', 'waterfall_session_id'];
    // contains source, ref, __
    let paramN = 1;
    let paramString = '';
    url.searchParams.forEach((paramValue, paramKey) => {
      let tempParamValue = '';
      // In whitelist
      if (wl.indexOf(paramKey) >= 0) {
        tempParamValue = FbLinkCleaner.generateSearchParam(paramKey, paramValue);
        // in whitelist with encoding
      } else if (wle.indexOf(paramKey) >= 0) {
        tempParamValue = FbLinkCleaner.generateSearchParam(paramKey, paramValue, true);
        // not in blacklist
      } else if (bl.indexOf(paramKey) === -1) {
        console.log(`Unknown param removed: ${paramKey} from ${url}`);
        const upd = window.fblnkcln.unknownParamsNumberDiv;
        upd.innerText = parseInt(upd.innerText, 10) + 1;
        upd.parentElement.style.display = 'flex';
      }
      if (tempParamValue !== '') {
        paramString += `${paramN === 1 ? '?' : '&'}${tempParamValue}`;
        paramN += 1;
      }
    });
    paramN = 1;
    return `${baseUrl}${paramString}`;
  }

  /**
   * Generates a search parameter string
   * @param {string} param the param name
   * @param {string} value the param value
   * @param {boolean} encode encode the value of the param
   * @returns {string} the generated search param string
   */
  static generateSearchParam(param, value, encode = false) {
    return `${param}=${encode ? encodeURIComponent(value) : value}`;
  }

  /**
   * Sets up a row for the current link
   * @param {string} href
   */
  setupRow(href) {
    const rowWrapper = FbLinkCleaner.newDiv('rowwrapper df jcsb');
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
   * Cancels click event on middle click
   * @param {MouseEvent} e
   */
  cancelClickOnMiddleClick(e) {
    if (!this.dHidden && e.button === 1) {
      FbLinkCleaner.stopEvent(e);
    }
  }

  /**
   * Prevent an event from its default action
   * @param e {Event}
   */
  static stopEvent(e) {
    e.preventDefault();
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
      FbLinkCleaner.stopEvent(e);
      // get the mouse cursor position at startup:
      currentX = e.clientX;
      currentY = e.clientY;
      document.onmouseup = () => {
        document.onmouseup = null;
        document.onmousemove = null;
      };
      // call a function whenever the cursor moves:
      document.onmousemove = (e2) => {
        FbLinkCleaner.stopEvent(e2);
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
    // eslint-disable-next-line no-extra-boolean-cast
    document.addEventListener(!!window.chrome ? 'auxclick' : 'mousedown', this.getOriginalLinkOnMiddleClick.bind(this));
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
