exports.constants = (key) => {
    const ADL_MAPPING = {
        Eating_noassistance:'We Provide No Assistance',
        Eating_intermittent:'Requires some Intermittent Supervision (ex, cutting up food, buttering bread, or opening a milk carton)',
        Eating_continual:'Requires Continual Help (meal would not be eaten without assistance)',
        Eating_byhand:'Fed completely by hand (no senior participation)',
        Eating_tube:'Tube or Parenteral Feeding for food intake',

        Transfers_none:'We Provide No Assistance',
        Transfers_intermittent:'Requires some Intermittent Supervision/ physical assistance for difficult maneuvers only',
        Transfers_oneperson:'Requires 1 Person to provide constant supervision / physical assistance',
        Transfers_twoperson:'Requires 2 People to provide constant supervision / physical assistance',
        Transfers_cannot:'Cannot and Does Not Get Out of Bed',

        Mobiliy_noassisstance:'We Provide No Assistance',
        Mobiliy_intermittent:'Requires some Intermittent Supervision/ physical assistance for difficult parts of walking (stairs, ramps, etc.)',
        Mobiliy_continual:'Requires one person to provide constant guidance / physical assistance',
        Mobiliy_wheels:'Wheels with no supervision or assistance (walkers, wheelchair, etc.)',
        Mobiliy_cannotmove:'Cannot move by themselves (wheeled, bedfast, chairfast)',

        Toileting_noassisstance:'We Provide No Assistance',
        Toileting_bowel:'Has bowel and bladder control but requires physical assistance with all parts of the task ( including catheters, colostomy bags, etc.)',
        Toileting_continual:'Requires one person to provide constant guidance / physical assistance',
        Toileting_nobathroomincontinent:'Incontinent and not taken to a bathroom',
        Toileting_bathroomincontinent:'Incontinent but is taken to a bathroom every 2-4 hours and as needed at night',

        Verbal_none:'None',
        Verbal_infrequent:'Infrequent disruption (no yelling within the past 7 days)',
        Verbal_predictable: 'Predictable disruption (for example, always yelling when it is time for a bath)',
        Verbal_onceunpredictable:'Unpredictable disruption at least once a week',
        Verbal_multipleunpredictable:'Unpredictable disruption multiple times per week',
 
        Physical_none : 'None',
        Physical_infrequent : 'Infrequent aggression (no hitting within the past 7 days)',
        Physical_predictable : 'Predictable aggression (for example, being aggressive in response to an event like getting bumped into)',
        Physical_onceunpredictable : 'Unpredictable aggression at least once a week',
        Physical_multipleunpredictable: 'Unpredictable aggression multiple times per week',

        Behaviourial_none : 'None',
        Behaviourial_yesnondisruptive : 'Yes, but is not disruptive to others',
        Behaviourial_infrequent : 'Infrequent Disruptive Behavior (not in the past 7 days)',
        Behaviourial_frequent : 'Frequent Disruptive Behavior (at least once a week)',
        Behaviourial_unpredictable: 'Unpredictable Disruptive Behavior (Multiple times per week)',


        Power_attorney: 'I have the Power of Attorney',
        Healthcare_proxy: 'I am the Healthcare Proxy for this Senior'
    };
    return ADL_MAPPING[key];
};