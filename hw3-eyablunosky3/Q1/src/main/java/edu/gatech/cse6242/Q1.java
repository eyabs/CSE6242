package edu.gatech.cse6242;

import java.io.IOException;

import org.apache.hadoop.fs.Path;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.io.*;
import org.apache.hadoop.mapreduce.*;
import org.apache.hadoop.util.*;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;

public class Q1 {

    public static class NodeMapper
      extends Mapper<Object, Text, Text, IntWritable>{
        Text node = new Text();
        IntWritable weight = new IntWritable();
        public void map(Object key, Text value, Context context
            ) throws IOException, InterruptedException {
            String [] values = value.toString().split("\t");
            
            node.set(values[0]);
            weight.set(Integer.parseInt(values[2]));
            
            context.write(node, weight);
        }
    }

    public static class IntMaxReducer
    extends Reducer<Text, IntWritable, Text, IntWritable> {
        private IntWritable result = new IntWritable();

        public void reduce(Text key, Iterable<IntWritable> values, Context context
            ) throws IOException, InterruptedException {
            int max = 0;
            for (IntWritable val : values) {
                if(val.get() > max){
                    max = val.get();
                }
            }
            result.set(max);
            context.write(key, result);
        }
    }

    public static void main(String[] args) throws Exception {
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Q1");
        job.setJarByClass(Q1.class);
        
        job.setOutputKeyClass(Text.class);
        job.setOutputValueClass(IntWritable.class);
        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
        
        job.setMapperClass(NodeMapper.class);
        job.setReducerClass(IntMaxReducer.class);

        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}
