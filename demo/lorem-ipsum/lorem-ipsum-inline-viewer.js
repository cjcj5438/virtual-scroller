import {ItemSource, VirtualScrollerElement} from '../../virtual-scroller-element.js';

class LoremIpsumInlineViewer extends VirtualScrollerElement {
  constructor() {
    super();

    this._items = undefined;
    this._htmlSpec = undefined;
    this._stream = undefined;
    this._adding = undefined;
  }

  connectedCallback() {
    super.connectedCallback();

    if (this._htmlSpec) return;

    if ('rootScroller' in document) {
      document.rootScroller = this;
    }

    const items = Array.from(this.children).filter(x => x.hasAttribute('invisible'));
    this._items = items;
    this.itemSource = ItemSource.fromArray(items);
    this.createElement = (item) => {
      item.removeAttribute('invisible');
      return item;
    };
    this.updateElement = (item, _, idx) => {
      if (idx >= this._items.length) {
        item.textContent = `Loading (index ${idx}, loaded ${
            this._items.length} / ${this.itemSource.length})`;
      }
    };
    this.recycleElement = (item) => {
      item.setAttribute('invisible', '');
    };

    this.addEventListener('activateinvisible', e => {
      let node = e.target;
      while (node && node.parentNode !== this) {
        node = node.parentNode;
      }

      if (node && node.parentNode === this) {
        const index = this._items.indexOf(node);
        if (index !== -1) {
          this.scrollToIndex(index);
        }
      }
    });
  }
}

customElements.define('lorem-ipsum-inline-viewer', LoremIpsumInlineViewer);
