const renderer = {
    stickyNotesColors : ["#FCAE7C", "#FFE699", "#eae672", "#B3F5BC", "#D6F6FF", "#E2CBF7", "#D1BDFF"],
    sections : document.getElementsByTagName("section"),
    h2s : document.getElementsByTagName("h2"),
    h4s : document.getElementsByTagName("h4"),
    anchors : document.getElementsByTagName("a"),
    sticky : document.getElementsByTagName("sticky"),

    renderIds : () => {
        for (let i=0; i < renderer.h2s.length; i++) 
            renderer.h2s[i].setAttribute("id", "_dynamic_h2_id_" + (i+1));
        for (let i=0; i < renderer.h4s.length; i++) 
            renderer.h4s[i].setAttribute("id", "_dynamic_h4_id_" + (i+1));
    },
    renderAnchors : () => {
        for (let i=0; i < renderer.anchors.length; i++) {
            renderer.anchors[i].setAttribute("target", "_blank");
        }
    },
    renderStickyNotes: () => {
        for (let i=0; i<renderer.sticky.length; i++) {
            const random = (Math.random() * 37000) % renderer.stickyNotesColors.length;
            renderer.sticky[i].style.background = renderer.stickyNotesColors[Math.floor(random)];
        }
    },
    renderUI : () => {
        renderer.renderIds();
        renderer.renderAnchors();
        renderer.renderStickyNotes();
    }
};
renderer.renderUI();