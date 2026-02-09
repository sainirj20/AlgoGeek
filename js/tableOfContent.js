const tableOfContent = {
    body : document.getElementById("table_of_content"),
    headingIndex : 0,
    load : () => {
        const list = document.getElementsByTagName("section");
        for (let i=0; i<list.length; i++) {
            const nodeList = list[i].childNodes;
            for (let ii=0; ii < nodeList.length; ii++) {
                tableOfContent.addContent(nodeList[ii], nodeList[ii].id);
            }
        }
    },
    addContent : (node, id) => {
        if ("H2" != node.nodeName && "H4" != node.nodeName) return null;

        const span = document.createElement("span");
        if ("H2" == node.nodeName) {
            span.style.marginLeft = "0";
            span.style.fontWeight = "bold";
            tableOfContent.headingIndex++;
            span.appendChild(tableOfContent.createAnchor(id, tableOfContent.headingIndex + ". " + node.textContent));
        } else if ("H4" == node.nodeName) {
            span.style.marginLeft = "40px";
            span.style.fontSize = "18px";
            span.style.color = "green";
            span.appendChild(tableOfContent.createAnchor(id, node.textContent));
        }
        tableOfContent.body.appendChild(span);
        tableOfContent.body.appendChild(document.createElement("br"));
    },
    createAnchor : (id, content) => {
        const anchor = document.createElement("a");
        anchor.href = "#" + id;
        anchor.innerText = content;
        anchor.onmouseleave = function() { anchor.style.color = "black"; };
        anchor.onmouseover = function() { anchor.style.color = "blue"; };
        return anchor;
    },
};
tableOfContent.load();