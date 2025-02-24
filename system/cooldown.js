let cooldowns = {};

function setCooldown(id, cmd, cd) {
    if (isCooldownExpired(id, cmd, cd)) {
        if (!cooldowns[id]) {
            cooldowns[id] = {};
        }
        cooldowns[id][cmd] = Date.now();
        return "cooldown set";
    } else {
        return "cooldown active";
    }
}

function isCooldownExpired(id, cmd, cd) {
    if (!cooldowns[id] || !cooldowns[id][cmd]) {
        return true;
    }
    const timePassed = (Date.now() - cooldowns[id][cmd]) / 1000;
    return timePassed >= cd;
}

module.exports = { setCooldown };
