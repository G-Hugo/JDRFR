<form class="{{cssClass}}" autocomplete="off">

    {{!-- Sheet Header --}}
    <header class="sheet-header">
        <img class="profile-img" src="{{actor.img}}" data-edit="img" title="{{actor.name}}" height="100" width="100"/>
        <div class="header-fields">
            <div>
                <h1 class="bioHeader">Fiche familier</h1>
            </div>
            <h1 class="charname"><input name="name" type="text" value="{{actor.name}}" placeholder="Name"/></h1>
            <div class="resources">
                <label class="resource-label" >Point de vie</label><p>
                <input class="resource-hp" type="text" name="data.hp.value" value="{{data.hp.value}}" data-dtype="Number"/>
                <span>-</span>
                <input class="resource-hp-max" type="text" name="data.hp.max" value="{{data.hp.max}}" data-dtype="Number"/>
            </div>
        </div>
    </header>

    {{!-- Sheet Tab Navigation --}}
    <nav class="sheet-tabs tabs" data-group="primary">
        <a class="item" data-tab="core">Information</a>
        <a class="item" data-tab="magie">Magie</a>
        <a class="item" data-tab="passif">Passif</a>
    </nav>

    {{!-- Sheet Body --}}
    <section class="sheet-body">

        {{!-- Core Tab --}}
        <div class="tab core" data-group="primary" data-tab="core">
            <div>
            <table class="core-sidebar1">
                <tr>
                    <th colspan="3" class="combat_table_header">Stats</th>
                </tr>
                <tr>
                    <th><input type="button" class="characteristic-roll" name="FORCE" id="for" value="FOR"></th>
                    <td><input name="data.characteristics.for.value" type="text" value="{{data.characteristics.for.value}}" data-dtype="Number"></td>
                    <td><input name="data.characteristics.for.modifieur" type="text" value="{{data.characteristics.for.modifieur}}" data-dtype="Number"></td>
                </tr>
                </tr>
                <tr>
                    <th><input type="button" class="characteristic-roll" name="AGILITE" id="agi" value="AGI"></th>
                    <td><input name="data.characteristics.agi.value" type="text" value="{{data.characteristics.agi.value}}" data-dtype="Number"></td>
                    <td><input name="data.characteristics.agi.modifieur" type="text" value="{{data.characteristics.agi.modifieur}}" data-dtype="Number"></td>
                </tr>
                <tr>
                    <th><input type="button" class="characteristic-roll" name="INTELLIGENCE" id="int" value="INT"></th>
                    <td><input name="data.characteristics.int.value" type="text" value="{{data.characteristics.int.value}}" data-dtype="Number"></td>
                    <td><input name="data.characteristics.int.modifieur" type="text" value="{{data.characteristics.int.modifieur}}" data-dtype="Number"></td>
                </tr>
                <tr>
                    <th><input type="button" class="characteristic-roll" name="PERCEPTION" id="per" value="PER"></th>
                    <td><input name="data.characteristics.per.value" type="text" value="{{data.characteristics.per.value}}" data-dtype="Number"></td>
                    <td><input name="data.characteristics.per.modifieur" type="text" value="{{data.characteristics.per.modifieur}}" data-dtype="Number"></td>
                </tr>
                <tr>
                    <th><input type="button" class="characteristic-roll" name="SOCIAL" id="soc" value="SOC"></th>
                    <td><input name="data.characteristics.soc.value" type="text" value="{{data.characteristics.soc.value}}" data-dtype="Number"></td>
                    <td><input name="data.characteristics.soc.modifieur" type="text" value="{{data.characteristics.soc.modifieur}}" data-dtype="Number"></td>
                </tr>
            </table>
            </div>
            <div class="core-sidebar2">
                <table>
                    <tr>
                        <th>Race</th>
                        <th>Propriétaire</th>
                        <th>Armure P</th>
                        <th>Armure M</th>
                    </tr>
                    <tr class="field-inputs">
                        <td><input type="text" name="data.race" value="{{data.race}}"></td>
                        <td><input type="text" name="data.proprietaire" value="{{data.proprietaire}}"></td>
                        <td><input type="text" name="data.armureP" value="{{data.armureP}}"></td>
                        <td><input type="text" name="data.armureM" value="{{data.armureM}}"></td>
                    </tr>
                </table>
                <table>
                    <tr>
                        <th colspan="2">Réussite critique</th>
                        <th colspan="1">-</th>
                        <th colspan="8">Echec critique</th>
                    </tr>
                    <tr>
                        <tr class="field-inputs">
                            <td><input type="text" name="reussite-critique-min" value="1" readonly></td>
                            <td><input type="text" name="data.reussite_critique_max" value="{{data.reussite_critique_max}}"></td>
                            <td><input type="text" disabled></td>
                            <td><input type="text" name="data.echec_critique_max" value="{{data.echec_critique_max}}"></td>
                            <td><input type="text" name="echec-critique-min" value="100" readonly></td>
                        </tr>
                    </tr>
                </table>
                <div>
                    <h2 class="bioHeader">Infos sur le familier</h2>
                    {{editor content=data.bio target="data.bio" button=true owner=owner editable=editable}}
                </div>
            </div>
        </div>

        {{!-- Magie Tab --}}
        <div class="tab magie" data-group="primary" data-tab="magie">
            <h2 class="bioHeader">Mettez ici tous ses sorts</h2>
            <div>
            {{editor content=data.magie target="data.magie" button=true owner=owner editable=editable}}
            </div>
        </div>

        {{!-- Passif Tab --}}
        <div class="tab passif" data-group="primary" data-tab="passif">
            <h2 class="bioHeader">Mettez ici tous ses bonus passifs</h2>
            <div>
            {{editor content=data.passif target="data.passif" button=true owner=owner editable=editable}}
            </div>
        </div>
        
    </section>
</form>

