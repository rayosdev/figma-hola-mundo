// TS Work Around
const tsWA = {
    includes(array, comparedElement) {
        if (array.length == 0)
            return false;
        let isFound = false;
        array.forEach(element => {
            if (JSON.stringify(element) == JSON.stringify(comparedElement)) {
                isFound = true;
                return;
            }
        });
        return isFound;
    }
};
// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(300, 400);
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    if (msg.type === 'create-rectangles') {
        const nodes = [];
        console.log(nodes);
        for (let i = 0; i < msg.count; i++) {
            const rect = figma.createRectangle();
            rect.x = i * 150;
            rect.fills = [{ type: 'SOLID', color: { r: 1, g: 0.5, b: 0 } }];
            figma.currentPage.appendChild(rect);
            nodes.push(rect);
        }
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
    }
    if (msg.type === 'reload') {
        figma.ui.close();
        figma.showUI(__html__);
    }
    if (msg.type === 'traverse') {
        let count = 0;
        let payload = {
            fonts: [],
            colors: []
        };
        function traverse(node) {
            if ("children" in node) {
                count++;
                if (node.type !== "INSTANCE") {
                    for (const child of node.children) {
                        if (child.fontName) {
                            if (tsWA.includes(payload.fonts, child.fontName) == false) {
                                let fontObj = child.fontName;
                                fontObj = { fontObj, name: child.name };
                                payload.fonts.push(fontObj);
                            }
                        }
                        traverse(child);
                        figma.ui.postMessage({ type: 'info', payload: payload });
                    }
                }
            }
        }
        traverse(figma.root); // start the traversal at the root
        // alert(count)
    }
    // Make sure to close the plugin when you're done. Otherwise the plugin will
    // keep running, which shows the cancel button at the bottom of the screen.
    // figma.closePlugin();
};
