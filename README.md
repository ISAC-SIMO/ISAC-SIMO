# ISAC SIMO

[![License](https://img.shields.io/badge/License-Apache2-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0) [![Slack](https://img.shields.io/badge/Join-Slack-blue)](https://join.slack.com/t/code-and-response/shared_invite/enQtNzkyMDUyODg1NDU5LTdkZDhmMjJkMWI1MDk1ODc2YTc2OTEwZTI4MGI3NDI0NmZmNTg0Zjg5NTVmYzNiNTYzNzRiM2JkZjYzOWIwMWE)

Intelligent Supervision Assistant for Construction - Sistema Inteligente de Monitoreo de Obra

ISAC-SIMO is a system to validate that the intervention work done for homeowners in Colombia has been done correctly and safely. It is a Build Change project supported by a grant from IBM. 

## Contents

1. [Target users](#target-users)
1. [Project detail](#demo-video)
1. [The architecture](#the-architecture)
1. [Project roadmap](#project-roadmap)
1. [Authors](#authors)
1. [License](#license)

## Target users
* Pedro the foreman builder in Colombia is able to receive complete well-specified, high-quality jobs safely and is paid [some percentage] more money and more quickly, which shows that it's worthwhile to do again and again. He is able to choose materials, know how far into a project he is, know when he will be paid, and understand the level of homeowner satisfaction so that he can take corrective action.

* Maria the homeowner is notified by FINDETER that her home needs an intervention in a timely manner, is able to receive a clear proposal of the work to be done within two days, to agree to the work, and to provide her input on the work. She is able to monitor the progress of the work [digitally or some other manner], provide feedback during and after the process, and feel confident that a quality job is done quickly and safely [with the help of a mobile app and AI].

* Juan the inspector is working for FINDETER and is able to ensure the quality and safety of the work done in his community is done at a better cost and in a more efficient manner so that more people get back into safe homes more quickly [some percentage]. He is able to receive notifications when work progresses so that he knows when to review digital documents or visit a site for inspection.

* _Everyone has visibility into the work and notified that's done in order to ensure it's done well, safely, and completely._

## Project detail
The technology consists of a mobile application used by all three roles in order to track the progression of an intervention on a home throughout the process to complete work. The application shows the progress of the work, and it can be validated through the analysis of the quality of two building elements, rebar and wall alignments.

### Mobile application
The mobile application is used to take photos of rebar and wall installations. With these photos, an assessment can be made as to whether they are acceptable (GO) or unacceptable (NO GO). This is powered by a machine learning model that has been trained with images of acceptable and unacceptable configurations.

### Machine learning model
The machine learning model is trained upon both generated and real world images classfied that have been processed into additional variants into GO and NO GO buckets. Beyond matching the supplied image against the models, additional analysis can be done to extract additional information from the images, such as brick centerpoint detection relative to other brick center points and edge detection.

Basic approach to classification

- Gather images
   1. Generate BIM model images
   1. Gather real world images
   1. Generate variations of the images

- Generate basic GO / NO GO
   1. Put them into GO and NO GO buckets to classify
   1. Train the model against the two classifiers
   1. Test images against the model
   1. Retrain to improve outcomes

- Enhanced approach to classification of brick wall images
   1. Score as above
   1. Apply centerpoint detection to GO images
   1. Further split into GO and NO GO images from that set
   1. Apply centerpoint detection to NO images

### Pipeline configuration model
Complementing the mobile application is a tool that provides the API endpoint for the images to be uploaded. This is a way for administrators to configure the pipeline and configure its thresholds.

## The architecture
TBD

## Project roadmap

View the [project board to track progress against the 1Q 2020 milestones](https://github.com/Code-and-Response/ISAC-SIMO/projects/2).

## Authors

* See the [contributors list](https://github.com/Code-and-Response/ISAC-SIMO/graphs/contributors)

## License

This project is licensed under the Apache 2 License - see the [LICENSE](LICENSE) file for details

