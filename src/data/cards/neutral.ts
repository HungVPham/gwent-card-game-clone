// src/data/cards/neutral.ts
import { CardType, Faction, RowPosition, CardAbility } from '../../types/card';

export const neutralHeroes = [
    {
        id: 'neutral_hero_01',
        name: 'Geralt of Rivia',
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        strength: 15,
        row: RowPosition.CLOSE,
        ability: CardAbility.MUSTER_ROACH,
        imageUrl: '/images/neutral/Geralt.png',
        description: 'Hero: Not affected by any Special Cards or abilities.'
    },
    {
        id: 'neutral_hero_02',
        name: 'Cirilla Fiona Elen Riannon',
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        strength: 15,
        row: RowPosition.CLOSE,
        ability: CardAbility.MUSTER_ROACH,
        imageUrl: '/images/neutral/Cirilla_Fiona_Elen_Riannon.jpg',
        description: 'Hero: Not affected by any Special Cards or abilities.'
    },
    {
        id: 'neutral_hero_03',
        name: 'Yennefer of Vengerberg',
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        strength: 7,
        row: RowPosition.RANGED,
        ability: CardAbility.MEDIC,
        imageUrl: '/images/neutral/Yennefer.png',
        description: 'Medic: Choose one card from your discard pile and play it instantly (no Heroes or Special Cards).'
    },
    {
        id: 'neutral_hero_04',
        name: 'Triss Merigold',
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        strength: 7,
        row: RowPosition.RANGED,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/Triss.png',
        description: 'Hero: Not affected by any Special Cards or abilities.'
    },
    {
        id: 'neutral_hero_05',
        name: 'Mysterious Elf',
        faction: Faction.NEUTRAL,
        type: CardType.HERO,
        strength: 0,
        row: RowPosition.CLOSE,
        ability: CardAbility.SPY,
        imageUrl: '/images/neutral/Mysterious_Elf.png',
        description: 'Spy: Place on your opponent\'s battlefield and draw 2 cards from your deck.'
    }
];

export const neutralUnits = [
    {
        id: 'neutral_unit_01',
        name: 'Dandelion',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 2,
        row: RowPosition.CLOSE,
        ability: CardAbility.COMMANDERS_HORN,
        imageUrl: '/images/neutral/dandelion.png'
    },
    {
        id: 'neutral_unit_02',
        name: 'Vesemir',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 6,
        row: RowPosition.CLOSE,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/vesemir.png'
    },
    {
        id: 'neutral_unit_03',
        name: 'Zoltan Chivay',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 5,
        row: RowPosition.CLOSE,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/zoltan.png'
    },
    {
        id: 'neutral_unit_04',
        name: 'Emiel Regis Rohellec Terzieff',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 5,
        row: RowPosition.CLOSE,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/emiel_regis.png'
    },
    {
        id: 'neutral_unit_05',
        name: 'Bovine Defense Force',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 8,
        row: RowPosition.CLOSE,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/bovine_defense_force.png'
    },
    {
        id: 'neutral_unit_06',
        name: 'Cow',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 0,
        row: RowPosition.CLOSE,
        ability: CardAbility.AVENGER,
        imageUrl: '/images/neutral/cow.png'
    },
    {
        id: 'neutral_unit_07',
        name: 'Olgierd von Everec',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 6,
        row: RowPosition.CLOSE,
        availableRows: [RowPosition.CLOSE, RowPosition.RANGED],
        ability: CardAbility.MORALE_BOOST,
        imageUrl: '/images/neutral/olgierd_von_everec.png',
        description: 'Morale Boost: Adds +1 to all units in the row (excluding itself).'
    },
    {
        id: 'neutral_unit_08',
        name: 'Roach',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 3,
        row: RowPosition.CLOSE,
        ability: CardAbility.NONE,
        imageUrl: '/images/neutral/roach.png'
    },
    {
        id: 'neutral_unit_09',
        name: 'Villentretenmerth',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 7,
        row: RowPosition.CLOSE,
        ability: CardAbility.SCORCH_CLOSE,
        imageUrl: '/images/neutral/villentretenmerth.png',
        description: 'Scorch - Close Combat: Destroy your enemy\'s strongest Close Combat unit(s) if the combined strength of all his or her Close Combat units is 10 or more.'
    },
    {
        id: 'neutral_unit_10',
        name: 'Gaunter O\'Dimm',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 2,
        row: RowPosition.SIEGE,
        ability: CardAbility.MUSTER,
        imageUrl: '/images/neutral/gaunt_odimm.png',
        description: 'Muster: Find any cards with the same name in your deck and play them instantly. '
    },
    {
        id: 'neutral_unit_11',
        name: 'Gaunter O\'Dimm: Darkness',
        faction: Faction.NEUTRAL,
        type: CardType.UNIT,
        strength: 4,
        row: RowPosition.RANGED,
        ability: CardAbility.MUSTER,
        imageUrl: '/images/neutral/gaunter_odimm_darkness.png',
        description: 'Muster: Find any cards with the same name in your deck and play them instantly. '
    },
];

export const neutralSpecials = [
    {
        id: 'neutral_special_01',
        name: 'Decoy',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.DECOY,
        imageUrl: '/images/neutral/decoy.png',
        description: 'Swap with a non-Hero unit on your side of the battlefield'
    },
    {
        id: 'neutral_special_02',
        name: 'Scorch',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.SCORCH,
        imageUrl: '/images/neutral/scorch.png',
        description: 'Destroys the strongest card(s) on the battlefield'
    },
    {
        id: 'neutral_special_03',
        name: 'Commander\'s Horn',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.COMMANDERS_HORN,
        imageUrl: '/images/neutral/commanders_horn.png',
        description: 'Doubles the strength of all unit cards in a row'
    },
    {
        id: 'neutral_special_04',
        name: 'Impenetrable Fog',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.FOG,
        imageUrl: '/images/neutral/impenetrable_fog.png',
        description: 'Sets the strength of all Ranged Combat units to 1'
    },
    {
        id: 'neutral_special_05',
        name: 'Torrential Rain',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.RAIN,
        imageUrl: '/images/neutral/torrential_rain.png',
        description: 'Sets the strength of all Siege units to 1'
    },
    {
        id: 'neutral_special_06',
        name: 'Biting Frost',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.FROST,
        imageUrl: '/images/neutral/biting_frost.png',
        description: 'Sets the strength of all Close Combat units to 1'
    },
    {
        id: 'neutral_special_07',
        name: 'Clear Weather',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.CLEAR_WEATHER,
        imageUrl: '/images/neutral/clear_weather.png',
        description: 'Removes all Weather Card effects'
    },
    {
        id: 'neutral_special_08',
        name: 'Skellige Storm',
        faction: Faction.NEUTRAL,
        type: CardType.SPECIAL,
        strength: 0,
        ability: CardAbility.SKELLIGE_STORM,  // Would need to be added to enum
        imageUrl: '/images/neutral/skellige_storm.png',
        description: 'Sets the strength of all Ranged and Siege units to 1'
    }
];

export const neutralDeck = {
    heroes: neutralHeroes,
    units: neutralUnits,
    specials: neutralSpecials
};