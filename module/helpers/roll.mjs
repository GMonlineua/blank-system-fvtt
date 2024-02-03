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
          const scar = document.getElementById('help').checked;
          const help = document.getElementById('help').checked;
          const betray = document.getElementById('betray').checked;

          const plusOne = [push, scar, help];

          await roll(actor, tension, betray, plusOne);
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

async function roll(actor, tension, betray, plusOne) {
  let dices = 1;
  if (betray) {
    dices = 3;
  } else {
    for (const element of plusOne) {
      dices += (element ? 1 : 0);
    }
  }

  const roll = new Roll(`${dices}d6`);
  roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor: actor }),
    flavor: tension,
    rollMode: game.settings.get('core', 'rollMode')
  });
}
