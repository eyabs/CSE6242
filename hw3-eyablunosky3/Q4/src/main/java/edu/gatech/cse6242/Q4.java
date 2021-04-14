package edu.gatech.cse6242;

import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;
import java.io.IOException;

public class Q4 {
    public static class DegreeMapper
        extends Mapper<Object, Text, Text, IntWritable>{

        IntWritable plusOne = new IntWritable(1);
        IntWritable minusOne = new IntWritable(-1);
        Text sourceNode = new Text();
        Text targetNode = new Text();

        public void map(Object key, Text value, Context context
            ) throws IOException, InterruptedException {
            String [] values = value.toString().split("\t");

            sourceNode.set(values[0]);
            targetNode.set(values[1]);

            context.write(sourceNode, plusOne);
            context.write(targetNode, minusOne);
        }
    }

    public static class DifferenceReducer
        extends Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values, Context context
            ) throws IOException, InterruptedException {
            int diff = 0;
            for (IntWritable val : values) {
                diff += val.get();
            }
            result.set(diff);
            context.write(key, result);
        }
    }

    public static class DifferenceMapper
        extends Mapper<Object, Text, Text, IntWritable>{

        IntWritable plusOne = new IntWritable(1);
        Text diff = new Text();

        public void map(Object key, Text value, Context context
            ) throws IOException, InterruptedException {
            String [] values = value.toString().split("\t");

            diff.set(values[1]);

            context.write(diff, plusOne);
        }
    }


    public static class DifferenceCountReducer
        extends Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values, Context context
            ) throws IOException, InterruptedException {
            int count = 0;
            for (IntWritable val : values) {
                count += val.get();
            }
            result.set(count);
            context.write(key, result);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Path inputPath = new Path(args[0]);
        Path outputPath = new Path(args[1]);

        Job collectDiffsJob = Job.getInstance(conf, "Q4 Collect Diffs");
        collectDiffsJob.setJarByClass(Q4.class);
        collectDiffsJob.setMapperClass(DegreeMapper.class);
        collectDiffsJob.setReducerClass(DifferenceReducer.class);
        collectDiffsJob.setOutputKeyClass(Text.class);
        collectDiffsJob.setOutputValueClass(IntWritable.class);
        FileInputFormat.addInputPath(collectDiffsJob, inputPath);
        FileOutputFormat.setOutputPath(collectDiffsJob, new Path(outputPath, "../temp"));
        /* TODO: Needs to be implemented */
        collectDiffsJob.waitForCompletion(true);

        Job countDiffsJob = Job.getInstance(conf, "Q4 Count Diffs");
        countDiffsJob.setJarByClass(Q4.class);
        countDiffsJob.setMapperClass(DifferenceMapper.class);
        countDiffsJob.setReducerClass(DifferenceCountReducer.class);
        countDiffsJob.setOutputKeyClass(Text.class);
        countDiffsJob.setOutputValueClass(IntWritable.class);
        FileInputFormat.addInputPath(countDiffsJob, new Path(outputPath, "../temp"));
        FileOutputFormat.setOutputPath(countDiffsJob, outputPath);

        System.exit(countDiffsJob.waitForCompletion(true) ? 0 : 1);
    }
}
