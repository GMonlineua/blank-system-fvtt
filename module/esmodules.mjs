// Import Modules
import { BlankActor } from "./documents/actor.mjs";
import { BlankActorSheet } from "./sheets/actor-sheet.mjs";
import { BlankItem } from "./documents/item.mjs";
import { BlankItemSheet } from "./sheets/item-sheet.mjs";
import { preprocessChatMessage, renderChatMessage } from "./helpers/chat-portraits.mjs";

Hooks.once('init', async function() {

  game.blank = {
    BlankActor,
    BlankItem
  };

  // Define custom Entity classes
  CONFIG.Actor.documentClass = BlankActor;
  CONFIG.Item.documentClass = BlankItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("blank", BlankActorSheet, { makeDefault: true });
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("blank", BlankItemSheet, { makeDefault: true });
});


/* -------------------------------------------- */
/*  Chat Message                   */
/* -------------------------------------------- */

// Preprocess chat message before it is created hook
Hooks.on("preCreateChatMessage", preprocessChatMessage);

// Render chat message hook
Hooks.on("renderChatMessage", renderChatMessage);


/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

Handlebars.registerHelper('getStyle', function(dice) {
  let style = ""

  if (dice.isResult) {
    if (dice.value == 6) {
      style = 'color: #18520b;filter: sepia(0.5) hue-rotate(60deg);'
    } else if (dice.value < 4) {
      style = 'color: #aa0200;filter: sepia(0.5) hue-rotate(-60deg);'
    }
  }

  return style
});
