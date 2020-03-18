# LIST OF CLASSIFIERS PIPELINE PASSES THORUGH (IN CASE OF NOGO FOR EXAMPLE)
# NEEDS TO BE CHANGED AS REQUIRED - IN SERVER, PRODUCTION, STAGE as required
classifier_list = [
    'DefaultCustomModel_1566448629',
    'IfNogo_778825345'
]

if(len(classifier_list) <= 0):
    print('-------------------------------------------------------------------------------------------')
    print('NO CLASSIFIERS MODEL PROVIDED')
    print('PLEASE EDIT isac_simo/classifier_list.py file and add model classifiers as required in list')
    print('-------------------------------------------------------------------------------------------')
else:
    print(str(len(classifier_list)) + ' Classifier Model Found.')