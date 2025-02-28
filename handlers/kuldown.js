let cooldowns = {};

function setCooldown(id, cmd, cd) {
    if (isCooldownOver(id, cmd, cd)) {
        if (!cooldowns[id]) {
            cooldowns[id] = {};
        }
        cooldowns[id][cmd] = Date.now();
        return "set";
    } else {
        return "not yet";
    }
}

function isCooldownOver(id, cmd, cd) {
    if (!cooldowns[id] || !cooldowns[id][cmd]) {
        return true;
    }
    const timePassed = (Date.now() - cooldowns[id][cmd]) / 1000; 
    return timePassed >= cd;
}

module.exports = { setCooldown };
