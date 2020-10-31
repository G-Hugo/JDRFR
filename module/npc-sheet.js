/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class npcSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
      classes: ["worldbuilding", "sheet", "actor", "npc"],
      template: "systems/uesrpg-d100/templates/npc-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs2", contentSelector: ".sheet-body", initial: "core"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const  data = super.getData(); 
    data.dtypes = ["String", "Number", "Boolean"];

    // Prepare Items
    if (this.actor.data.type == 'npc') {
      this._prepareCharacterItems(data);
    }
    return  data;
    }
  
    _prepareCharacterItems(sheetData) {
      const actorData = sheetData.actor;

      //Initialize containers
      const gear = [];
      const weapon = [];
      const armor = [];
      const spell = {
        alteration: [],
        conjuration: [],
        destruction: [],
        illusion: [],
        mysticism: [],
        necromancy: [],
        restoration: []
      };

      //Iterate through items, allocating to containers
      //let totaWeight = 0;
      for (let i of sheetData.items) {
        let item = i.data;
        i.img = i.img || DEFAULT_TOKEN;
        //Append to item
        if (i.type === 'item') {
          gear.push(i);
        }
        //Append to weapons
        else if (i.type === 'weapon') {
          weapon.push(i);
        }
        //Append to armor
        else if (i.type === 'armor') {
          armor.push(i);
        }
        //Append to spell
        else if (i.type === 'spell') {
          if (i.data.school != undefined) {
            spell[i.data.school].push(i);
          }
        }
      }

      //Assign and return
      actorData.gear = gear;
      actorData.weapon = weapon;
      actorData.armor = armor;
      actorData.spell = spell;

    }

    get template() {
      if (!game.user.isGM && this.actor.limited) return "systems/uesrpg-d100/templates/limited-npc-sheet.html"; 
      return "systems/uesrpg-d100/templates/npc-sheet.html";
    }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      this.actor.deleteOwnedItem(li.data("itemId"));
      li.slideUp(200, () => this.render(false));
    });

  }
}
