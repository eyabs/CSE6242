from scipy import stats
import numpy as np

def is_numeric(x):
    try:
        float(x)
        return True
    except ValueError:
        return False

# This method computes entropy for information gain
def entropy(class_y):
    # Input:            
    #   class_y         : list of class labels (0's and 1's)
    
    # TODO: Compute the entropy for a list of classes
    #
    # Example:
    #    entropy([0,0,0,1,1,1,1,1,1]) = 0.92
    if len(class_y) <= 0:
        return 0.0
    p_1 = np.mean(class_y)
    p_0 = 1 - p_1
    entropy = -1 * sum([(prob * np.log2(prob)) for prob in [p_0, p_1] if prob > 0])
    if np.isnan(entropy):
        return 0.0

    return entropy


def partition_classes(X, y, split_attribute, split_val):
    # Inputs:
    #   X               : data containing all attributes
    #   y               : labels
    #   split_attribute : column index of the attribute to split on
    #   split_val       : either a numerical or categorical value to divide the split_attribute
    
    # TODO: Partition the data(X) and labels(y) based on the split value - BINARY SPLIT.
    # 
    # You will have to first check if the split attribute is numerical or categorical    
    # If the split attribute is numeric, split_val should be a numerical value
    # For example, your split_val could be the mean of the values of split_attribute
    # If the split attribute is categorical, split_val should be one of the categories.   
    #
    # You can perform the partition in the following way
    # Numeric Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all
    #   the rows where the split attribute is less than or equal to the split value, and the 
    #   second list has all the rows where the split attribute is greater than the split 
    #   value. Also create two lists(y_left and y_right) with the corresponding y labels.
    #
    # Categorical Split Attribute:
    #   Split the data X into two lists(X_left and X_right) where the first list has all 
    #   the rows where the split attribute is equal to the split value, and the second list
    #   has all the rows where the split attribute is not equal to the split value.
    #   Also create two lists(y_left and y_right) with the corresponding y labels.

    '''
    Example:
    
    X = [[3, 'aa', 10],                 y = [1,
         [1, 'bb', 22],                      1,
         [2, 'cc', 28],                      0,
         [5, 'bb', 32],                      0,
         [4, 'cc', 32]]                      1]
    
    Here, columns 0 and 2 represent numeric attributes, while column 1 is a categorical attribute.
    
    Consider the case where we call the function with split_attribute = 0 and split_val = 3 (mean of column 0)
    Then we divide X into two lists - X_left, where column 0 is <= 3  and X_right, where column 0 is > 3.
    
    X_left = [[3, 'aa', 10],                 y_left = [1,
              [1, 'bb', 22],                           1,
              [2, 'cc', 28]]                           0]
              
    X_right = [[5, 'bb', 32],                y_right = [0,
               [4, 'cc', 32]]                           1]

    Consider another case where we call the function with split_attribute = 1 and split_val = 'bb'
    Then we divide X into two lists, one where column 1 is 'bb', and the other where it is not 'bb'.
        
    X_left = [[1, 'bb', 22],                 y_left = [1,
              [5, 'bb', 32]]                           0]
              
    X_right = [[3, 'aa', 10],                y_right = [1,
               [2, 'cc', 28],                           0,
               [4, 'cc', 32]]                           1]
               
    ''' 

    left_filter = []
    right_filter = []
    if is_numeric(X[0][split_attribute]):
        left_filter = [i for i in range(len(X)) if X[i][split_attribute] >= split_val]
        right_filter = [i for i in range(len(X)) if X[i][split_attribute] < split_val]
    else:
        left_filter = [i for i in range(len(X)) if X[i][split_attribute] == split_val]
        right_filter = [i for i in range(len(X)) if X[i][split_attribute] != split_val]


    X_left = [X[i] for i in left_filter]
    X_right = [X[i] for i in right_filter]
    
    y_left = [y[i] for i in left_filter]
    y_right = [y[i] for i in right_filter]
    
    return (X_left, X_right, y_left, y_right)

    
def information_gain(previous_y, current_y):
    # Inputs:
    #   previous_y: the distribution of original labels (0's and 1's)
    #   current_y:  the distribution of labels after splitting based on a particular
    #               split attribute and split value
    
    # TODO: Compute and return the information gain from partitioning the previous_y labels
    # into the current_y labels.
    # You will need to use the entropy function above to compute information gain
    # Reference: http://www.cs.cmu.edu/afs/cs.cmu.edu/academic/class/15381-s06/www/DTs.pdf
    
    """
    Example:
    
    previous_y = [0,0,0,1,1,1]
    current_y = [[0,0], [1,1,1,0]]
    
    info_gain = 0.45915
    """
    prob_l = len(current_y[0]) / float(len(previous_y))
    prob_r = 1 - prob_l
    info_gain = (
        entropy(previous_y) -
        (prob_l * entropy(current_y[0]) +
         prob_r * entropy(current_y[1]))
    )

    return info_gain

def print_matrix(X, y):
    for row in range(len(X)):
        print(X[row], y[row])
