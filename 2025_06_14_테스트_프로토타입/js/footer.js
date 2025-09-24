class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="main-footer">
        <p>© 2025 햄찌백과 | 제작자: 민제 | 문의: qkralswp7918@google.com</p>
      </footer>
    `;
  }
}
customElements.define('hamzzi-footer', FooterComponent);