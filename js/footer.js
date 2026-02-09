/**
 * Injects a self-contained, styled footer into the page.
 */
function injectStyledFooter(targetSelector = 'body') {
    // 1. Define the CSS
    const css = `
        .site-footer {
            background-color: #000000bd;
            color: #ffffff;
            padding: 20px 8px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin-top: 24px;
        }
        .footer-container {
            max-width: 1100px;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 30px;
        }
        .footer-column {
            flex: 1;
            min-width: 200px;
        }
        .footer-column h3 {
            margin-bottom: 20px;
            color: #00d4ff;
            font-size: 1.2rem;
        }
        .footer-column p {
            line-height: 1.6;
            color: #ccc;
        }
        .footer-column ul {
            list-style: none;
            padding: 0;
        }
        .footer-column ul li {
            margin-bottom: 10px;
        }
        .footer-column a {
            color: #ccc;
            text-decoration: none;
            transition: color 0.3s, padding-left 0.3s;
        }
        .footer-column a:hover {
            color: #fff;
            padding-left: 5px;
        }
        .footer-bottom {
            text-align: center;
            margin-top: 20px;
            border-top: 1px solid #666565;
            padding-top: 4px;
            font-size: 0.85rem;
            color: #777;
        }
        @media (max-width: 600px) {
            .footer-container { flex-direction: column; text-align: center; }
        }
    `;

    // 2. Inject CSS into the <head>
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 3. Define the HTML Structure
    const footerHTML = `
        <footer class="site-footer">
            <div class="footer-container">
                <div class="footer-column">
                    <h3>BrandName</h3>
                    <p>Building the future of the web, one component at a time. Clean, efficient, and modern.</p>
                </div>
                <div class="footer-column">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">About</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Socials</h3>
                    <ul>
                        <li><a href="#">LinkedIn</a></li>
                        <li><a href="#">GitHub</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom"></div>
        </footer>
    `;

    // 4. Inject the HTML
    const target = document.querySelector(targetSelector);
    if (target) {
        target.insertAdjacentHTML('beforeend', footerHTML);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    injectStyledFooter('html');
});