## Data and Visual Analytics - Homework 4
## Georgia Institute of Technology
## Applying ML algorithms to detect seizure

import numpy as np
import pandas as pd
import time

from sklearn.model_selection import cross_val_score, GridSearchCV, cross_validate, train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.svm import SVC
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, normalize

######################################### Reading and Splitting the Data ###############################################
# XXX
# TODO: Read in all the data. Replace the 'xxx' with the path to the data set.
# XXX
data = pd.read_csv('./seizure_dataset.csv')

# Separate out the x_data and y_data.
x_data = data.loc[:, data.columns != "y"]
y_data = data.loc[:, "y"]

# The random state to use while splitting the data.
random_state = 100

# XXX
# TODO: Split 70% of the data into training and 30% into test sets. Call them x_train, x_test, y_train and y_test.
# Use the train_test_split method in sklearn with the paramater 'shuffle' set to true and the 'random_state' set to 100.
# XXX

x_train, x_test, y_train, y_test = train_test_split(
    x_data, y_data, test_size=0.3, shuffle=True, random_state=random_state)

# ############################################### Linear Regression ###################################################
# XXX
# TODO: Create a LinearRegression classifier and train it.
# XXX

regr = LinearRegression()

regr.fit(x_train, y_train)

# XXX
# TODO: Test its accuracy (on the training set) using the accuracy_score method.
# TODO: Test its accuracy (on the testing set) using the accuracy_score method.
# Note: Use y_predict.round() to get 1 or 0 as the output.
# XXX

y_train_predict_regr = regr.predict(x_train)
regr_train_accuracy = accuracy_score(y_train, y_train_predict_regr.round())
print('Linear Regression Classifier Train Accuracy (untuned): {:.0%}'.format(regr_train_accuracy))

y_test_predict_regr = regr.predict(x_test)
regr_test_accuracy = accuracy_score(y_test, y_test_predict_regr.round())
print('Linear Regression Classifier Test Accuracy (untuned): {:.0%}'.format(regr_test_accuracy))

# ############################################### Multi Layer Perceptron #################################################
# XXX
# TODO: Create an MLPClassifier and train it.
# XXX


mlp = MLPClassifier()
mlp.fit(x_train, y_train)


# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX


y_train_predict_mlp = mlp.predict(x_train)
mlp_train_accuracy = accuracy_score(y_train, y_train_predict_mlp.round())
print('MLP Classifier Train Accuracy (untuned): {:.0%}'.format(mlp_train_accuracy))

y_test_predict_mlp = mlp.predict(x_test)
mlp_test_accuracy = accuracy_score(y_test, y_test_predict_mlp.round())
print('MLP Classifier Test Accuracy (untuned): {:.0%}'.format(mlp_test_accuracy))


# ############################################### Random Forest Classifier ##############################################
# XXX
# TODO: Create a RandomForestClassifier and train it.
# XXX


rf = RandomForestClassifier()
rf.fit(x_train, y_train)


# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

y_train_predict_rf = rf.predict(x_train)
rf_train_accuracy = accuracy_score(y_train, y_train_predict_rf.round())
print('Random Forest Classifier Train Accuracy (untuned): {:.0%}'.format(rf_train_accuracy))

y_test_predict_rf = rf.predict(x_test)
rf_test_accuracy = accuracy_score(y_test, y_test_predict_rf.round())
print('Random Forest Classifier Test Accuracy (untuned): {:.0%}'.format(rf_test_accuracy))


# XXX
# TODO: Tune the hyper-parameters 'n_estimators' and 'max_depth'.
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX

rf_n_estimators = [25, 50, 100]

rf_max_depths = [8, 32, 2277, None]

rf_grid = {'n_estimators': rf_n_estimators, 'max_depth': rf_max_depths}
rf2 = RandomForestClassifier()
rf_cv = GridSearchCV(rf2, rf_grid, cv=10, n_jobs=3)
rf_cv.fit(x_train, y_train)

print('Random Forest Classifier Best Params: {}'.format(rf_cv.best_params_))
print('Random Forest Classifier Best Score: {:.0%}'.format(rf_cv.best_score_))

y_test_pred_rf_cv = rf_cv.predict(x_test)
rf_cv_test_accuracy = accuracy_score(y_test, y_test_pred_rf_cv.round())
print('Random Forest Classifier Test Accuracy (CV Tuned): {:.0%}'.format(rf_cv_test_accuracy))



# ############################################ Support Vector Machine ###################################################
# XXX
# TODO: Pre-process the data to standardize or normalize it, otherwise the grid search will take much longer
# TODO: Create a SVC classifier and train it.
# XXX

svm_scaler = StandardScaler().fit(x_train)
x_train_scaled = svm_scaler.transform(x_train)
x_test_scaled = svm_scaler.transform(x_test)

svm = SVC()
svm.fit(x_train, y_train)

# XXX
# TODO: Test its accuracy on the training set using the accuracy_score method.
# TODO: Test its accuracy on the test set using the accuracy_score method.
# XXX

y_train_predict_svm = svm.predict(x_train)
svm_train_accuracy = accuracy_score(y_train, y_train_predict_svm.round())
print('SVM Classifier Train Accuracy (untuned): {:.0%}'.format(svm_train_accuracy))

y_test_predict_svm = svm.predict(x_test)
svm_test_accuracy = accuracy_score(y_test, y_test_predict_svm.round())
print('SVM Classifier Test Accuracy (untuned): {:.0%}'.format(svm_test_accuracy))

# XXX
# TODO: Tune the hyper-parameters 'C' and 'kernel' (use rbf and linear).
#       Print the best params, using .best_params_, and print the best score, using .best_score_.
# XXX

svm_Cs = [0.001, 0.1, 10]
svm_kernels = ['linear', 'rbf']

svm_grid = {'C': svm_Cs, 'kernel': svm_kernels}
svm2 = SVC()
svm_cv = GridSearchCV(svm2, svm_grid, cv=10, n_jobs=3)
svm_cv.fit(x_train_scaled, y_train)

print('SVM Classifier Best Params: {}'.format(svm_cv.best_params_))
print('SVM Classifier Best Score: {:.0%}'.format(svm_cv.best_score_))


y_test_pred_svm_cv = svm_cv.predict(x_test_scaled)
svm_cv_test_accuracy = accuracy_score(y_test, y_test_pred_svm_cv.round())
print('SVM Classifier Test Accuracy (CV Tuned): {:.0%}'.format(svm_cv_test_accuracy))


print('SVM Classifier Mean Train Score: {:.0%}'.format(svm_cv.cv_results_['mean_train_score'][svm_cv.best_index_]))
print('SVM Classifier Mean Train Score: {:.0%}'.format(svm_cv.cv_results_['mean_test_score'][svm_cv.best_index_]))
print('SVM Classifier Mean Fit Time: {:.3f}'.format(svm_cv.cv_results_['mean_fit_time'][svm_cv.best_index_]))
