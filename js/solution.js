const renderer = {
    question : document.getElementsByTagName("question"),
    notes : document.getElementsByTagName("notes"),
    snippet : document.getElementsByTagName("snippet"),
    anchors : document.getElementsByTagName("a"),
    renderUI : () => {
        if (renderer.question) renderer._format(renderer.question);
        if (renderer.notes) renderer._format(renderer.notes);
        if (renderer.snippet) renderer.renderSnippet();
        for (let i=0; i < renderer.anchors.length; i++) {
            renderer.anchors[i].setAttribute("target", "_blank");
        }
    },
    _format : (htmls) => {
        for (let i = 0; i<htmls.length; i++) {
            if (!htmls[i].innerHTML) continue;
            const temp = htmls[i].innerHTML.split('\n');
            let newHtml = '';
            let preStarted = false;
            for (let j = 0; j < temp.length; j++) {
                if(temp[j].includes("<pre>")) preStarted = true;
                else if(temp[j].includes("</pre>")) preStarted = false;

                const xxx = preStarted ? temp[j] : temp[j].trim();
                if (xxx.length == 0) {
                    if (j == 0 || j == temp.length-1 ) continue;
                    newHtml += "<span style='line-height:0.8; display:block;'>\u00A0</span>";
                } else {
                    newHtml += (xxx.endsWith('ul>') || xxx.endsWith('li>')) ? xxx : xxx + "<br />";
                }
            }
            htmls[i].innerHTML = newHtml;
        }
    },
    renderSnippet : () => {
        let tabString = `<div class="tab-wrapper"><div class="tab-menu">`;
        for (let i = 0; i<renderer.snippet.length; i++) {
            tabString += '<button class="tab-btn '+ (i==0 ? 'active' : '') + '" onclick="openTab(event, \'Tab' + (i+1) + '\')">Solution '+ (i+1) + '</button>'
        }
        tabString += `</div>`;
        for (let i = 0; i<renderer.snippet.length; i++) {
            tabString += '<div id="Tab' +  (i+1) + '" class="tab-content ' + (i==0 ? 'active' : '') + '"><pre><code class="language-java">';
            tabString += renderer.snippet[i].innerHTML;
            tabString += `</code></pre></div>`;
        }
        renderer.snippet[0].innerHTML = tabString;
        for (let i = 1; i<renderer.snippet.length; i++) {
            renderer.snippet[i].innerHTML = null;
        }
    },
};
renderer.renderUI();

function openTab(evt, tabId) {
    // 1. Hide all content by removing 'active' class
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    // 2. Deactivate all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    // 3. Show the specific tab and activate the button
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}