export async function createRollDialog(actor) {
  const html = await renderTemplate("systems/blank/templates/rollDialog.hbs");

  const dialog = new Dialog({
    title: "Roll Dice",
    content: html,
    buttons: {
      roll: {
        label: "Roll",
        icon: '<i class="fas fa-dice"></i>',
        callback: async (html) => {
          const tension = document.getElementById('tension').value;
          const push = document.getElementById('push').checked;
          const scar = document.getElementById('scar').checked;
          const help = document.getElementById('help').checked;
          const betray = document.getElementById('betray').checked;

          const plusOne = [push, scar, help];

          const rollData = {
            speaker: ChatMessage.getSpeaker({ actor: actor }),
            tension: tension,
            push: push,
            scar: scar,
            help: help,
            betray: betray,
            diceCount: 1
          }

          await roll(rollData);
        },
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: "Cancel",
        callback: () => {},
      },
    },
    default: "roll",
    close: () => {},
  });
  dialog.render(true);
}

async function roll(rollData) {
  if (rollData.betray) {
    rollData.diceCount = 3;
  } else {
    const plusOne = [rollData.push, rollData.scar, rollData.help]

    for (const element of plusOne) {
      rollData.diceCount += (element ? 1 : 0);
    }
  }

  rollData = await getRollResults(rollData);

  console.log(rollData)

  const rollMessage = await renderTemplate("systems/blank/templates/rollResult.hbs", rollData);
  const chatData = {
    speaker: rollData.speaker,
    content: rollMessage,
    type: CONST.CHAT_MESSAGE_TYPES.ROLL,
    sound: CONFIG.sounds.dice
  };

  ChatMessage.create(chatData);
}

async function getRollResults(rollData) {
  const roll = new Roll(`${rollData.diceCount}d6`);
  await roll.evaluate({ async: true });

  const results = roll.terms[0].results.map((result) => ({ value: result.result, isResult: false }));

  const maxResult = Math.max(...results.map(result => result.value));
  const maxResultDice = results.find(result => result.value === maxResult);
  if (maxResultDice) {
    maxResultDice.isResult = true;
  }

  if (maxResult === 6) {
    rollData.result = 'success';
  } else if (maxResult >= 4 && maxResult <= 5) {
    rollData.result = 'mixed';
  } else {
    rollData.result = 'fail';
  }

  rollData.dice = results;

  const messageList = {
    uneasy: {
      success: "do it",
      mixed: "lesser version or can try via a tense roll",
      fail: "don’t achieve, GM takes a point of dread, character can try a different approach"
    },
    tense: {
      success: "do it",
      mixed: "lesser version, suffer a consequence, and the GM takes a point of dread",
      fail: "don’t achieve, suffer a severe consequence (2 dread) or increase despair by 1, character can try a different approach"
    },
    desperate: {
      success: "do it and 1 dread",
      mixed: "do it, 2 dread, suffer a severe consequence or raise despair by 1",
      fail: "don’t achieve, suffer a severe consequence, increase despair by 1, 2 dread"
    }
  }

  rollData.resultMessage = messageList[rollData.tension][rollData.result];

  return rollData;
}

