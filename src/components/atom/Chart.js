import React from "react";
import {View,Text,Dimensions} from "react-native";
import color from "../../theme/colors";
import font from "../../theme/font";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";
const Chart =(props)=>{
    return(
        <View>
  <LineChart
    data={props.data}
    width={Dimensions.get("window").width-10} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: color.secondary,
      backgroundGradientFrom: color.secondary,
      backgroundGradientTo: color.secondary,
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: color.primary
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius:5,
      marginHorizontal:5
    }}
  />
</View>
    )
}

export default React.memo(Chart);