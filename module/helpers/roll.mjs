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
          try {
            const tension = document.getElementById('tension').value;
            const push = document.getElementById('push').checked;
            const help = document.getElementById('help').checked;
            const betray = document.getElementById('betray').checked;
            console.log(tension, push, help, betray)

            await roll(actor);
          } catch (error) {
            console.error("Error submit in roll dialog:", error);
          }
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

async function roll(actor, rollData) {
  console.log(data)
}
