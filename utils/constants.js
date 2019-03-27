exports.constants = (key) => {
    const ADL_MAPPING = {
        'Eating_noassistance':'We do not provide any assistance',
        'Eating_intermittent':'We can provide some intermittent supervision (e.g. cutting up food, buttering butter or opening of milk carton)',
        Eating_continual:'We can provide continual help(meal would not be eaten without assistance)',
        Eating_byhand:'We can feed a senior completely by hand(no senior participation)',
        Eating_tube:'We can provide Tube or Parental Feeding for food intake',
        Dailyliving_intermittent:'Requires some intermittent supervision/ physical assistance for difficult maneuvers only',
        Dailyliving_oneperson:'Requires 1 Person to provide constant supervision / physical assistance',
        Dailyliving_twopeople:'Requires 2 People to provide constant supervision / physical assistance',
        Dailyliving_bed:'Cannot and Does Not Get Out of Bed',
        Behaviourial_disruption1 : 'Infrequent disruption (no yelling within the past 7 days)',
        Behaviourial_aggression1 : 'Infrequent aggression (no hitting within the past 7 days)',
        Behaviourial_disruption2 : 'Unpredictable disruption at least once a week',
        Behaviourial_aggression2 : 'Unpredictable aggression at least once a week',
    };
    return ADL_MAPPING[key];
};