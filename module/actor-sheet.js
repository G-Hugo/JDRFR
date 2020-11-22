/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class SimpleActorSheet extends ActorSheet {

  /** @override */
	static get defaultOptions() {
	  return mergeObject(super.defaultOptions, {
  	  classes: ["worldbuilding", "sheet", "actor"],
  	  template: "systems/uesrpg-d100/templates/actor-sheet.html",
      width: 600,
      height: 600,
      tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}],
      dragDrop: [{dragSelector: ".item-list .item", dropSelector: null}]
    });
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    const  data = super.getData(); 
    data.dtypes = ["String", "Number", "Boolean"];

    // Prepare Items
    if (this.actor.data.type == 'character') {
      this._prepareCharacterItems(data);
    }

    return data;
    }

    _prepareCharacterItems(sheetData) {
      const actorData = sheetData.actor;

      //Initialize containers
      const gear = [];
      const weapon = {
        none: [],
        weapon1: [],
        weapon2: [],
        weapon3: []
      };
      const armor = [];
      const power = [];
      const trait = [];
      const talent = [];
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
          if (i.data.category != undefined) {
            weapon[i.data.category].push(i);
          }
        }
        //Append to armor
        else if (i.type === 'armor') {
          armor.push(i);
        }
        //Append to power
        else if (i.type === 'power') {
          power.push(i);
        }
        //Append to trait
        else if (i.type === 'trait') {
          trait.push(i);
        }
        //Append to talent
        else if (i.type === 'talent') {
          talent.push(i);
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
      actorData.power = power;
      actorData.trait = trait;
      actorData.talent = talent;
      actorData.spell = spell;

    }

  /* -------------------------------------------- */

  /** @override */
	activateListeners(html) {
    super.activateListeners(html);

    // Rollable Buttons
    html.find(".characteristic-roll").click(this._onClickCharacteristic.bind(this));
    html.find(".skill-roll").click(this._onSkillRoll.bind(this));
    html.find(".magic-skill-roll").click(this._onMagicSkillRoll.bind(this));
    html.find(".weapon-roll").click(this._onWeaponRoll.bind(this));
    html.find(".combat-style-roll").click(this._onCombatRoll.bind(this));
    html.find(".spell-roll").click(this._onSpellRoll.bind(this));

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return;

    // Update Inventory Item
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find('.item-img').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.getOwnedItem(li.data("itemId"));
      item.sheet.render(true);
    });

    html.find('.item-name').click(ev => {
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

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */

  _onClickCharacteristic(event) {
    event.preventDefault()
    const element = event.currentTarget
    let wounded_char = this.actor.data.data.characteristics[element.id].value - 20

    let d = new Dialog({
      title: "Apply Roll Modifier",
      content: `<form>
                  <div class="dialogForm">
                  <label><b>${element.name} Modifier: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                </form>`,
      buttons: {
        one: {
          label: "Roll!",
          callback: html => {
            const playerInput = parseInt(html.find('[id="playerInput"]').val());

    let roll = new Roll("1d100");
    roll.roll();

      if (this.actor.data.data.wounded == true) {
        if (roll.total == this.actor.data.data.lucky_numbers.ln1 || roll.total == this.actor.data.data.lucky_numbers.ln2 || roll.total == this.actor.data.data.lucky_numbers.ln3 || roll.total == this.actor.data.data.lucky_numbers.ln4 || roll.total == this.actor.data.data.lucky_numbers.ln5) {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${wounded_char} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          <span style='color:green; font-size:120%;'> <b>LUCKY NUMBER!</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
    
        } else if (roll.total == this.actor.data.data.unlucky_numbers.ul1 || roll.total == this.actor.data.data.unlucky_numbers.ul2 || roll.total == this.actor.data.data.unlucky_numbers.ul3 || roll.total == this.actor.data.data.unlucky_numbers.ul4 || roll.total == this.actor.data.data.unlucky_numbers.ul5) {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${wounded_char} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          <span style='color:red; font-size:120%;'> <b>UNLUCKY NUMBER!</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
    
        } else {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${wounded_char} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          <b>${roll.total<=wounded_char ? " <span style='color:green; font-size: 120%;'> <b>SUCCESS!</b></span>" : " <span style='color:red; font-size: 120%;'> <b>FAILURE!</b></span>"}`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        } 
      } else {
      if (roll.total == this.actor.data.data.lucky_numbers.ln1 || roll.total == this.actor.data.data.lucky_numbers.ln2 || roll.total == this.actor.data.data.lucky_numbers.ln3 || roll.total == this.actor.data.data.lucky_numbers.ln4 || roll.total == this.actor.data.data.lucky_numbers.ln5) {
        const content = `Rolls for <b>${element.name}</b>!
        <p></p><b>Target Number: [[${this.actor.data.data.characteristics[element.id].value} + ${playerInput}]]</b> <p></p>
        <b>Result: [[${roll.total}]]</b><p></p>
        <span style='color:green; font-size:120%;'> <b>LUCKY NUMBER!</b></span>`
        roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

      } else if (roll.total == this.actor.data.data.unlucky_numbers.ul1 || roll.total == this.actor.data.data.unlucky_numbers.ul2 || roll.total == this.actor.data.data.unlucky_numbers.ul3 || roll.total == this.actor.data.data.unlucky_numbers.ul4 || roll.total == this.actor.data.data.unlucky_numbers.ul5) {
        const content = `Rolls for <b>${element.name}</b>!
        <p></p><b>Target Number: [[${this.actor.data.data.characteristics[element.id].value} + ${playerInput}]]</b> <p></p>
        <b>Result: [[${roll.total}]]</b><p></p>
        <span style='color:red; font-size:120%;'> <b>UNLUCKY NUMBER!</b></span>`
        roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

      } else {
        const content = `Rolls for <b>${element.name}</b>!
        <p></p><b>Target Number: [[${this.actor.data.data.characteristics[element.id].value} + ${playerInput}]]</b> <p></p>
        <b>Result: [[${roll.total}]]</b><p></p>
        <b>${roll.total<=(this.actor.data.data.characteristics[element.id].value + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>SUCCESS!</b></span>" : " <span style='color:red; font-size: 120%;'> <b>FAILURE!</b></span>"}`
        roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
      }
    } 
    }
  },
  two: {
    label: "Cancel",
    callback: html => console.log("Cancelled")
  }
  },
  default: "one",
  close: html => console.log()
  });
  d.render(true);
  }

  _onSkillRoll(event) {
  event.preventDefault()
  const element = event.currentTarget
  
  let d = new Dialog({
    title: "Apply Roll Modifier",
    content: `<form>
                <div class="dialogForm">
                <label><b>${element.name} Modifier: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
              </form>`,
    buttons: {
      one: {
        label: "Roll!",
        callback: html => {
          const playerInput = parseInt(html.find('[id="playerInput"]').val());
          let roll = new Roll("1d100");
          roll.roll();
        
          if (roll.total == this.actor.data.data.lucky_numbers.ln1 || roll.total == this.actor.data.data.lucky_numbers.ln2 || roll.total == this.actor.data.data.lucky_numbers.ln3 || roll.total == this.actor.data.data.lucky_numbers.ln4 || roll.total == this.actor.data.data.lucky_numbers.ln5) {
            const content = `Rolls for <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.skills[element.id].tn}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            <span style='color:green; font-size:120%;'> <b>LUCKY NUMBER!</b></span>`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        
          } else if (roll.total == this.actor.data.data.unlucky_numbers.ul1 || roll.total == this.actor.data.data.unlucky_numbers.ul2 || roll.total == this.actor.data.data.unlucky_numbers.ul3 || roll.total == this.actor.data.data.unlucky_numbers.ul4 || roll.total == this.actor.data.data.unlucky_numbers.ul5) {
            const content = `Rolls for <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.skills[element.id].tn}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            <span style='color:red; font-size:120%;'> <b>UNLUCKY NUMBER!</b></span>`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        
          } else {
            const content = `Rolls for <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.skills[element.id].tn} + ${playerInput}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            ${roll.total<=(this.actor.data.data.skills[element.id].tn + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>SUCCESS!</b></span>" : " <span style='color:red; font-size: 120%;'> <b>FAILURE!</b></span>"}`
        
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
            }
        }
      },
      two: {
        label: "Cancel",
        callback: html => console.log("Cancelled")
      }
    },
    default: "one",
    close: html => console.log()
  });
  d.render(true);
  }

  _onMagicSkillRoll(event) {
    event.preventDefault()
    const element = event.currentTarget

    let d = new Dialog({
      title: "Apply Roll Modifier",
      content: `<form>
                  <div class="dialogForm">
                  <label><b>${element.name} Modifier: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                </form>`,
      buttons: {
        one: {
          label: "Roll!",
          callback: html => {
            const playerInput = parseInt(html.find('[id="playerInput"]').val());
  
        let roll = new Roll("1d100");
        roll.roll();
      
        if (roll.total == this.actor.data.data.lucky_numbers.ln1 || roll.total == this.actor.data.data.lucky_numbers.ln2 || roll.total == this.actor.data.data.lucky_numbers.ln3 || roll.total == this.actor.data.data.lucky_numbers.ln4 || roll.total == this.actor.data.data.lucky_numbers.ln5) {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          <span style='color:green; font-size:120%;'> <b>LUCKY NUMBER!</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

        } else if (roll.total == this.actor.data.data.unlucky_numbers.ul1 || roll.total == this.actor.data.data.unlucky_numbers.ul2 || roll.total == this.actor.data.data.unlucky_numbers.ul3 || roll.total == this.actor.data.data.unlucky_numbers.ul4 || roll.total == this.actor.data.data.unlucky_numbers.ul5) {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          <span style='color:red; font-size:120%;'> <b>UNLUCKY NUMBER!</b></span>`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

        } else {
          const content = `Rolls for <b>${element.name}</b>!
          <p></p><b>Target Number: [[${this.actor.data.data.magic_skills[element.id].tn} + ${playerInput}]]</b> <p></p>
          <b>Result: [[${roll.total}]]</b><p></p>
          ${roll.total<=(this.actor.data.data.magic_skills[element.id].tn + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>SUCCESS!</b></span>" : " <span style='color: red; font-size: 120%;'> <b>FAILURE!</b></span>"}`
          roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
        }
      }
    },
        two: {
          label: "Cancel",
          callback: html => console.log("Cancelled")
        }
        },
        default: "one",
        close: html => console.log()
        });
        d.render(true);
          }

  _onWeaponRoll(event) {
    event.preventDefault()
    const element = event.currentTarget
    let hit_loc = ""

    let roll = new Roll(this.actor.data.data.weapons[element.id].dmg);
    roll.roll();
    let hit = new Roll("1d10");
    hit.roll();

    if (hit.total <= 5) {
      hit_loc = "Body"
    } else if (hit.total == 6) {
      hit_loc = "Right Leg"
    } else if (hit.total == 7) {
      hit_loc = "Left Leg"
    } else if (hit.total == 8) {
      hit_loc = "Right Arm"
    } else if (hit.total == 9) {
      hit_loc = "Left Arm"
    } else if (hit.total == 10) {
      hit_loc = "Head"
    }

    const content = `Rolls damage for their <b>${this.actor.data.data.weapons[element.id].name}!</b>
    <p></p>
    <b>Damage:</b> <b>[[${roll.total}]]</b><p></p>
    <b>Hit Location:</b> <b>${hit_loc} [[${hit.total}]]</b><p></p>
    <b>Qualities:</b> ${this.actor.data.data.weapons[element.id].qualities}
    `
    roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

  _onSpellRoll(event) {
    event.preventDefault()
    const element = event.currentTarget
    let hit_loc = ""

    let roll = new Roll(this.actor.data.data.prep_spells[element.id].dmg);
    roll.roll();
    let hit = new Roll("1d10");
    hit.roll();

    if (hit.total <= 5) {
      hit_loc = "Body"
    } else if (hit.total == 6) {
      hit_loc = "Right Leg"
    } else if (hit.total == 7) {
      hit_loc = "Left Leg"
    } else if (hit.total == 8) {
      hit_loc = "Right Arm"
    } else if (hit.total == 9) {
      hit_loc = "Left Arm"
    } else if (hit.total == 10) {
      hit_loc = "Head"
    }

    const content = `Casts the spell <b>${this.actor.data.data.prep_spells[element.id].name}!</b>
    <p></p>
    <b>Damage:[[${roll.total}]]
    <p></p>
    Hit Location: ${hit_loc} [[${hit.total}]]
    <p></p>
    MP Cost: [[${this.actor.data.data.prep_spells[element.id].cost}]]
    <p></p>
    Attributes:</b> ${this.actor.data.data.prep_spells[element.id].attributes}`

    roll.toMessage({type: 1, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
  }

  _onCombatRoll(event) {
    event.preventDefault()
    const element = event.currentTarget

    let d = new Dialog({
      title: "Apply Roll Modifier",
      content: `<form>
                  <div class="dialogForm">
                  <label><b>${element.name} Modifier: </b></label><input placeholder="ex. -20, +10" id="playerInput" value="0" style=" text-align: center; width: 50%; border-style: groove; float: right;" type="text"></input></div>
                </form>`,
      buttons: {
        one: {
          label: "Roll!",
          callback: html => {
            const playerInput = parseInt(html.find('[id="playerInput"]').val());

          let roll = new Roll("1d100");
          roll.roll();

          if (roll.total == this.actor.data.data.lucky_numbers.ln1 || roll.total == this.actor.data.data.lucky_numbers.ln2 || roll.total == this.actor.data.data.lucky_numbers.ln3 || roll.total == this.actor.data.data.lucky_numbers.ln4 || roll.total == this.actor.data.data.lucky_numbers.ln5) {
            const content = `Rolls Combat Style <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.combat_styles[element.id].tn} + ${playerInput}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            <span style='color:green; font-size:120%;'> <b>LUCKY NUMBER!</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else if (roll.total == this.actor.data.data.unlucky_numbers.ul1 || roll.total == this.actor.data.data.unlucky_numbers.ul2 || roll.total == this.actor.data.data.unlucky_numbers.ul3 || roll.total == this.actor.data.data.unlucky_numbers.ul4 || roll.total == this.actor.data.data.unlucky_numbers.ul5) {
            const content = `Rolls Combat Style <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.combat_styles[element.id].tn} + ${playerInput}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            <span style='color:red; font-size:120%;'> <b>UNLUCKY NUMBER!</b></span>`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});

          } else {
            const content = `Rolls Combat Style <b>${element.name}</b>!
            <p></p><b>Target Number: [[${this.actor.data.data.combat_styles[element.id].tn} + ${playerInput}]]</b> <p></p>
            <b>Result: [[${roll.total}]]</b><p></p>
            <b>${roll.total<=(this.actor.data.data.combat_styles[element.id].tn + playerInput) ? " <span style='color:green; font-size: 120%;'> <b>SUCCESS!</b></span>" : " <span style='color: red; font-size: 120%;'> <b>FAILURE!</b></span>"}`
            roll.toMessage({type: 4, user: game.user._id, speaker: ChatMessage.getSpeaker(), content: content});
          }
        }
      },
      two: {
        label: "Cancel",
        callback: html => console.log("Cancelled")
      }
      },
      default: "one",
      close: html => console.log()
      });
      d.render(true);
        }

}
