/* HADY ZEN'IN */

let hadi = {};
function kuldown(id, cmd, cd) {
    if (jeda(id, cmd, cd)) {
        if (!hadi[id]) {
            hadi[id] = {};
        }
        hadi[id][cmd] = Date.now();
        return "hadi";
    } else {
        return "pipi";
    }
}

function jeda(id, cmd, cd) {
    if (!hadi[id] || !hadi[id][cmd]) {
        return true;
    }
    const timePassed = (Date.now() - hadi[id][cmd]) / 1000; 
    return timePassed >= cd;
}

module.exports = { kuldown };
