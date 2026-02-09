const questions = {
    li : document.getElementsByTagName("span"),
    load : () => {
        questions.display("important_questions_red", "red");
        questions.display("important_questions_yellow", "yellow");
        questions.display("important_questions_green", "green");
        questions.display("important_questions_bold", "bold");
    },
    display : (id, className) => {
        const body = document.getElementById(id);
        const nodeList = questions.filter(className);
        let ii = 0;
        while (ii < nodeList.length) {
            if ("A" == nodeList[ii].nodeName) {
                const span = questions.createItem(nodeList[ii]);
                span.classList.add(className);
                body.appendChild(span);
                if (nodeList[ii].classList.contains("capsule")) body.appendChild(questions.createItem(nodeList[++ii]));
                body.appendChild(document.createElement("br"));
            }
            ii++;
        }
    },
    filter : (className) => {
        const result = [];
        for (let i=0; i<questions.li.length; i++) {
            const nodeList = questions.li[i];
            for (let ii=0; ii < nodeList.childNodes.length; ii++) {
                const node = nodeList.childNodes[ii];
                if ("BUTTON" == node.nodeName || ("A" == node.nodeName && node.classList.contains(className))) result.push(node);
            }
        }
        return result;
    },
    createItem : (node) => {
        const anchor = document.createElement("a");
        anchor.href = node.getAttribute("href");
        anchor.innerHTML = node.innerHTML;
        anchor.target = "_blank";
        if ("BUTTON" == node.nodeName) {
            anchor.onmouseleave = function() { anchor.style.color = "black"; };
            anchor.onmouseover = function() { anchor.style.color = "blue"; };
            return anchor;
        }
        const span = document.createElement("span");
        span.appendChild(anchor);
        return span;
    },
};
questions.load();