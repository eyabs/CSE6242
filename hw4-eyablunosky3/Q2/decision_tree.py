from util import entropy, information_gain, partition_classes, is_numeric
import numpy as np
from statistics import mode
import ast


class DecisionTree(object):
    def __init__(self, max_iterations = 1000000):
        # Initializing the tree as an empty dictionary or list, as preferred
        #self.tree = []
        self.tree = {}
        self.iterations = 0
        self.max_iterations = max_iterations

    def _evaluate_split(self, X, y, split_attribute, split_value):
        _, _, left, right = partition_classes(X, y, split_attribute, split_value)
        info_gain = information_gain(y, [left, right])
        return info_gain

    def _get_midpoints(self, x):
        x = np.sort(np.unique(x))
        midpoints = [(x[i] + x[i + 1]) / 2.0 for i in range(len(x - 1))]
        return midpoints

    def _get_unique_values(self, x):
        categories = np.unique(x).tolist()
        return categories

    def _evaluate_column(self, X, y, split_attribute):
        col = [row[split_attribute] for row in X]
        best_info_gain = None
        best_split_value = None
        for value in self._get_unique_values(col):
            info_gain = self._evaluate_split(X, y, split_attribute, value)
            #print(split_attribute, value, info_gain, best_info_gain)
            if best_info_gain is None:
                best_info_gain = info_gain
                best_split_value = value
            if (info_gain > best_info_gain):
                best_info_gain = info_gain
                best_split_value = value
        return best_info_gain, best_split_value

    def _check_stop(self, X, y):
        if self.iterations > self.max_iterations:
            #print("stopping: max_iterations exceeeded")
            return True
        if len(np.unique(y)) <= 1:
            #print("stopping: perfectly isolated y")
            return True
        if len(np.unique(X, axis=0)) <= 1:
            #print("stopping: all X's are the same.")
            return True
        #print('No Stopping Conditions Found.')
        return False

    def _build_tree(self, X, y):
        self.iterations = self.iterations + 1
        # TODO: Train the decision tree (self.tree) using the the sample X and labels y
        # You will have to make use of the functions in utils.py to train the tree

        # One possible way of implementing the tree:
        #    Each node in self.tree could be in the form of a dictionary:
        #       https://docs.python.org/2/library/stdtypes.html#mapping-types-dict
        #    For example, a non-leaf node with two children can have a 'left' key and  a
        #    'right' key. You can add more keys which might help in classification
        #    (eg. split attribute and split value)
        if(self._check_stop(X, y)):
            leaf = {"Leaf": True, "Value": mode(y)}
            return leaf

        best_info_gain = None
        best_split_attribute = None
        best_split_value = None
        for col in range(len(X[0])):
            info_gain, split_value = self._evaluate_column(X, y, col)
            if best_info_gain is None:
                best_info_gain = info_gain
                best_split_attribute = col
                best_split_value = split_value
            if info_gain > best_info_gain:
                best_info_gain = info_gain
                best_split_attribute = col
                best_split_value = split_value

        left_X, right_X, left_y, right_y = partition_classes(X, y, best_split_attribute, best_split_value)

        branch = {
            "Leaf": False,
            "SplitAttribute": best_split_attribute,
            "SplitValue": best_split_value,
            "Left": self._build_tree(left_X, left_y),
            "Right": self._build_tree(right_X, right_y)
        }
        return branch

    def learn(self, X, y):
        self.tree = self._build_tree(X, y)

    def _evaluate_node(self, record, node):
        if node['Leaf']:
            return node['Value']

        attribute = record[node['SplitAttribute']]
        if is_numeric(attribute):
            use_left_branch = attribute >= node['SplitValue']
        else:
            use_left_branch = attribute == node['SplitValue']
        if use_left_branch:
            return self._evaluate_node(record, node['Left'])
        return self._evaluate_node(record, node['Right'])

    def classify(self, record):
        return self._evaluate_node(record, self.tree)
