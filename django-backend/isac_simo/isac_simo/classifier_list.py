from django.db.models import Prefetch
try:
    from api.models import Classifier, ObjectType
except ImportError as e:
    print(e)
    print('Classifier list model import error')

# LIST OF CLASSIFIERS PIPELINE PASSES THORUGH (IN CASE OF NOGO FOR EXAMPLE)
# NEEDS TO BE CHANGED AS REQUIRED - IN SERVER, PRODUCTION, STAGE as required
detect_object_model_id = '9068cba3-6dab-4233-805b-2d64a16daae8'

# def classifier_list(): # Previous Name (now data function used for short name to enable reload())
#     pass

def data():
    classifier_list = {
        'wall':[
            'IfNogo_778825345'
        ],
        'rebar':[
            'DefaultCustomModel_1566448629',
            'IfNogo_778825345'
        ],
    }

    try:
        object_types = ObjectType.objects.order_by('updated_at').all().prefetch_related(Prefetch('classifiers', queryset=Classifier.objects.order_by('order')))
        # object_types = ObjectType.objects.order_by('updated_at').all().prefetch_related('classifiers')
        for object_type in object_types:
            if not classifier_list.get(object_type.name.lower(), False):
                classifier_list[object_type.name.lower()] = []

            for classifier in object_type.classifiers.all():
                if classifier.name not in classifier_list.get(object_type.name.lower(),[]):
                    classifier_list[object_type.name.lower()] = classifier_list.get(object_type.name.lower(),[]) + [classifier.name]

        print('-LOADING CLASSIFIER LIST-')
        print(classifier_list)
        return classifier_list
    except Exception as e:
        #########
        print(e)
        print('Classifier List throwing Model exception - IF KEEPS REPEATING IT IS A BIG DEAL (Once is OK)')
        return classifier_list

total_classifiers = len(data())
if(total_classifiers <= 0):
    print('-------------------------------------------------------------------------------------------')
    print('NO CLASSIFIERS MODEL TYPES PROVIDED')
    print('PLEASE EDIT isac_simo/classifier_list.py file and add model classifiers as required in list')
    print('OR Ask Admin user to train and add new classifier')
    print('-------------------------------------------------------------------------------------------')
else:
    print(str(total_classifiers) + ' Classifier Model Type Found.')
