/**
 * A simple and flexible system for world-building using an arbitrary collection of character and item attributes
 * Author: Atropos
 * Software License: GNU GPLv3
 */

// Import Modules
import { SimpleActor } from "./actor.js";
import { SimpleItem } from "./item.js";
import { SimpleFamilier } from "./familier.js";
import { SimpleItemSheet } from "./item-sheet.js";
import { SimpleActorSheet } from "./actor-sheet.js";
import { SimpleFamilierSheet } from "./familier-sheet.js";
import { npcSheet } from "./npc-sheet.js";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

Hooks.once("init", async function() {
  console.log(`Initializing UESRPG System`);

	/**
	 * Set an initiative formula for the system
	 * @type {String}
	 */
	CONFIG.Combat.initiative = {
    formula: "1d6 + @initiative.base",
    decimals: 0
  };

	// Define custom Entity classes
  CONFIG.Actor.entityClass = SimpleActor;
  CONFIG.Familier.entityClass = SimpleFamilier;
  CONFIG.Item.entityClass = SimpleItem;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("uesrpg-d100-modifie", SimpleActorSheet, {types: ["character"], makeDefault: true});
  Familier.unregisterSheet("core", FamilierSheet);
  Familier.registerSheet("uesrpg-d100-modifie", SimpleFamilierSheet, {types: ["character"], makeDefault: true});
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("uesrpg-d100-modifie", SimpleItemSheet, {types: ["item", "armor", "weapon", "spell", "trait", "talent", "power", "combatStyle", "ammunition"], makeDefault: true});
  Actors.registerSheet("uesrpg-d100-modifie", npcSheet, {types: ["npc"], makeDefault: true});

  // Register system settings
  game.settings.register("uesrpg-d100-modifie", "legacyUntrainedPenalty", {
    name: "Legacy Untrained Penalty",
    hint: "Checking this option enables the UESRPG v2 penalty for Untrained skills at -20 instead of the standard -10. Must refresh the client manually (F5) after selecting this option to see the changes on actor sheets.",
    scope: "world",
    config: true,
    default: false,
    type: Boolean
  });
});
