# Seismic Activity 
A study of earthquake magnitude and depth between September - October 2020.
[Final Visualization](https://justinkraus.github.io/earthquake/)  

## Initial Analysis
The [dataset](https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php) depicts all seismic activity detected by the United States Geological Service (USGS). The USGS monitors seismic events through a series of monitoring stations placed throughout the United States. Collectively these can measure seismic events all over the world.

As I was previously unfamiliar with earthquake data, I used Excel to observe distributions around certain fields. I first looked at magnitude (the size of the event) and noticed peaks around 1.1 and 4.5 magnitude.

![](https://lh3.googleusercontent.com/PFRS-5FIautNNK3Qi3nDGjuRPsCTxysxAoQgbttsRcxsduiUz5sISaprulLi_L3888eFyaX2auVaW5wA0lApKlUP0zef5-GGLj_3OkfQgenwdgVWlxtU-FmEf8u0cngFj-4aJrIA)

Magnitude is measured on the Richter scale, a 1-10 logarithmic scale. The logarithmic aspect is important as it means the energy output rises exponentially as the measurements move up: a difference of one represents a thirty-fold increase in magnitude. 

For the visualization, I decided I wanted to show the actual energy output of the seismic event versus the Richter measurement. To do this, I converted the Richter measurements to the energy output using the [formulas here](http://www.science.earthjay.com/instruction/HSU/2016_spring/GEOL_460/reports/460_eq_reports.pdf).

![](https://lh6.googleusercontent.com/0_yVYnpinjxdH5olMM70mr5CWhj2aA7vFDTNw54sEBK4tG16hxbesZFM4CWlNa-dXZTP7w3WNGGkHdCT2AGMoY-wY7ehJkc6R-_KcXVFrl85YXyVJ_PdOvDjYbT9y62HoVuUkehk)  
Formulas to convert Richter magnitude to energy

## Iteration 1
With the true energy output added to the dataset, I investigated what this would look like in a basic Tableau visualization. In the below visualization: 

 - X-axis shows monitoring location where the event was registered
 - Y-axis shows depth (how far underground) of the event
 - Circle size shows energy output of the event
 - Color shows magnitude of the event

![](https://lh6.googleusercontent.com/eSJl26m92_W6ir68X-vMEAd63QMZOFIDy-p-VGi_DExdRlfGtY2OjksqJyWqcbwNyW_6PaUICcKXDs1vAc6dYc6jWInBwpnG6SeB6_pFtetcECoGBm6zZquqksQjVSmOBfbtCkWG)
[Interactive Tableau Public Gallery](https://public.tableau.com/profile/justin.k7646#!/vizhome/earthquake2_16020451824820/Sheet2)  

The majority of seismic activity is low-magnitude and occurs at a relatively shallow depth. What isn't apparent in the first iteration is that there are 13k+ seismic events being shown because there is a significant overlap of these points.

## Iteration 2
To better depict this I needed to add some “jitter” which would separate these overlapping points. However even with jitter it was apparent that there were too many data points to show everything. I researched this problem and read a post by Mike Bostock who suggests when scatterplots have too many points it's probably best to consider representing the data as a filled area. I like this approach but still wanted to show single events and discovered the [violin jitter plot](https://www.d3-graph-gallery.com/graph/violin_jitter.html) that satisfies both approaches.

![](https://lh6.googleusercontent.com/Qc5nvd62iZ6Oa17XtmErOWIcLhYrDTEj9t3AR8mzTMOLDUc2O13zpOgZwEpXjAku86U4hpAgF7iUHKUIyGYE-WvDIi4NstgGkAXbESinCZG9Pt2nivqytyd60TOz9ZcV9-dV8jxu)
For the first violin jitter plot, I replicated the existing Tableau graph in D3. I added a background gradient fill to illustrate the depth change and give a representation of how the layers of earth might change from soil to rock. It's apparent that the US bucket has a high variation of seismic activity compared with the other locations that are more concentrated with shallower depths.

## Final Iteration
 I focused the visualization on the US location and incorporated a tooltip which provides information about each event.

![](https://lh6.googleusercontent.com/nTU9Wq6yvH4TsWGPdFqhnmhw8-3dS3W7kfEY2EihyoRraukm3qiSi_XFI3GDOa40_QSwGrOrPcATJSzBsW8elg4VF5CQAzn6PLKVnacFoL30Z4B7Lf-95o_feLW8XRp0PqsFgZfo)

Live @ [https://justinkraus.github.io/earthquake/](https://justinkraus.github.io/earthquake/)