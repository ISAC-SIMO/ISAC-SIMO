# LIST OF CLASSIFIERS PIPELINE PASSES THORUGH (IN CASE OF NOGO FOR EXAMPLE)
# NEEDS TO BE CHANGED AS REQUIRED - IN SERVER, PRODUCTION, STAGE as required
detect_object_model_id = '9068cba3-6dab-4233-805b-2d64a16daae8'

classifier_list = {
    'wall':[
        'DefaultCustomModel_1566448629',
        'IfNogo_778825345'
    ],
    'rebar':[
        'DefaultCustomModel_1566448629',
        'IfNogo_778825345'
    ],
}

if(len(classifier_list) <= 0):
    print('-------------------------------------------------------------------------------------------')
    print('NO CLASSIFIERS MODEL TYPES PROVIDED')
    print('PLEASE EDIT isac_simo/classifier_list.py file and add model classifiers as required in list')
    print('-------------------------------------------------------------------------------------------')
else:
    print(str(len(classifier_list)) + ' Classifier Model Type Found.')