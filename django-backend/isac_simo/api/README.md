# Important Notes

### Creating Offline Models:
**Attributes:**

- Name = Offline Model Name (max length=200)
- Model Type = ``OBJECT_DETECT`` or ``CLASSIFIER``
- Model Format = File Format of model (h5, py etc.)
- File = Upload File with format as provided
- Model Labels = Multiple labels with what this model will return (with proper index)

> Type: Object Detect is linked in Projects & Classifier is linked while creating offline model classifiers.

**Output:**

The final output should always be in the format of 2-dimensional array ``[[0.650, 0.211]]`` *(For any Model Format)*

The array output will be linked to specific index of model labels provided. For example, if the labels provided are ``cat, dog`` then 0.650 will be cat and 0.211 will be dog.

> In case of **python3 .py** model format make sure to name the main function ``run(pillow_instance, labels=[])`` which takes the pillow instance of image as first parameter and labels (can be empty) as 2nd parameter . It must returns the 2-dimensional prediction output.  
>*[ Make sure to get rid of all unnecessary codes like deleting the input files etc. ]*