const fbclid = 'fbclid';

class FbLinkCleaner {
  constructor() {
    window.fblnkcln = this;
    // Generate all components
    this.main = FbLinkCleaner.setupMainDiv();
    const headerDiv = FbLinkCleaner.setupHeaderDiv();
    this.setupDialogDrag(headerDiv);
    const closeBtn = FbLinkCleaner.setupCloseBtn();
    headerDiv.appendChild(closeBtn);
    const bodyDiv = FbLinkCleaner.setupBodyDiv();
    const footerDiv = FbLinkCleaner.setupFooterDiv();
    this.main.append(headerDiv, bodyDiv, footerDiv);
    document.oncontextmenu = (e) => {
      if (e.target.tagName === 'A') {
        const aHref = new URL(e.target.href);
        const uParam = aHref.searchParams.get('u');
        let origLink;
        if (uParam) {
          origLink = FbLinkCleaner.generateOrigLink(new URL(uParam));
        } else {
          origLink = FbLinkCleaner.generateOrigLink(aHref);
        }
        console.log(origLink);
      }
    };
  }

  static generateOrigLink(url) {
    let baseUrl = `${url.protocol}//${url.hostname}${url.pathname}`;
    if (url.search.lastIndexOf(fbclid) > 0) {
      baseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      baseUrl += `${url.search.substring(0, (url.search.lastIndexOf(fbclid) - 1))}`;
    }
    return baseUrl;
  }

  static setupFooterDiv() {
    const footerDiv = document.createElement('div');
    footerDiv.style.cssText = 'background:aqua;flex:0 1 10px';
    return footerDiv;
  }

  static setupBodyDiv() {
    const bodyDiv = document.createElement('div');
    bodyDiv.style.cssText = 'background:aliceblue;flex:1 1 auto';
    return bodyDiv;
  }

  static setupHeaderDiv() {
    const headerDiv = document.createElement('div');
    headerDiv.style.cssText = 'background:purple;flex:0 1 auto;display:flex;justify-content:flex-end;cursor:move';
    return headerDiv;
  }

  static setupCloseBtn() {
    const closeBtn = document.createElement('button');
    closeBtn.style.all = 'unset';
    closeBtn.title = 'Close';
    closeBtn.style.cssText = 'border:none;padding:0 5px;background:transparent;cursor:pointer';
    closeBtn.innerText = 'X';
    closeBtn.onclick = () => {
      window.fblnkcln.hideDialog();
    };
    return closeBtn;
  }

  static setupMainDiv() {
    const mainDiv = document.createElement('div');
    mainDiv.style.cssText = 'padding:0;marign:0;box-sizing:border-box;position:fixed;width:100px;height:100px;top:0;left:0;background:orange;z-index:1000000;display:flex;flex-direction:column';
    mainDiv.id = 'fblnkclnid';
    document.querySelector('body')
      .appendChild(mainDiv);
    return mainDiv;
  }

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
   * Hide the dialog
   */
  hideDialog() {
    this.main.style.visibility = 'hidden';
    this.main.style.opacity = '0';
  }

  /**
   * Show and reset dialog
   */
  showDialog() {
    const mainDivStyle = this.main.style;
    mainDivStyle.visibility = 'visible';
    mainDivStyle.opacity = '1';
    mainDivStyle.top = '0';
    mainDivStyle.left = '0';
  }
}

(window.fblnkcln || new FbLinkCleaner()).showDialog();
