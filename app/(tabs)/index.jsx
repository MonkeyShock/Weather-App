import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { Stack } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const imagensClima = {
  dia: require("../../assets/images/Dia.png"),
  diaChuva: require("../../assets/images/Dia_chuva.png"),
  manha: require("../../assets/images/manha.png"),
  neblina: require("../../assets/images/neblina.png"),
  neve: require("../../assets/images/Neve.png"),
  noite: require("../../assets/images/noite.png"),
  noiteChuva: require("../../assets/images/Noite_chuva.png"),
  padrao: require("../../assets/images/Dia.png"),
};

function getFoto(tempNumber, hora, condicao) {
  const isDia = hora >= 6 && hora < 18;
  const condicaoLower = condicao.toLowerCase();

  if (condicaoLower.includes("snow") || condicaoLower.includes("neve")) {
    return imagensClima.neve;
  }
  if (condicaoLower.includes("rain") || condicaoLower.includes("chuva")) {
    return isDia ? imagensClima.diaChuva : imagensClima.noiteChuva;
  }
  if (
    condicaoLower.includes("fog") ||
    condicaoLower.includes("neb") ||
    condicaoLower.includes("cloud") ||
    condicaoLower.includes("nublado")
  ) {
    return imagensClima.neblina;
  }
  if (isDia && hora >= 5 && hora < 9) {
    return imagensClima.manha;
  }
  if (isDia) {
    return imagensClima.dia;
  }
  return imagensClima.noite;
}

// Convert OpenWeather condition codes to icons
function getWeatherIcon(conditionCode) {
  // Convert condition code to a descriptive string using the OpenWeather condition code
  // See: https://openweathermap.org/weather-conditions
  const codeGroup = Math.floor(conditionCode / 100);
  let description = "";

  switch (codeGroup) {
    case 2: // Thunderstorm
      description = "thunderstorm";
      break;
    case 3: // Drizzle
      description = "drizzle";
      break;
    case 5: // Rain
      description = "rain";
      break;
    case 6: // Snow
      description = "snow";
      break;
    case 7: // Atmosphere (fog, mist, etc.)
      if (conditionCode === 701) description = "mist";
      else if (conditionCode === 721) description = "haze";
      else if (conditionCode === 741) description = "fog";
      else description = "hazy";
      break;
    case 8: // Clear or clouds
      if (conditionCode === 800) description = "clear sky";
      else if (conditionCode === 801) description = "few clouds";
      else if (conditionCode === 802) description = "scattered clouds";
      else if (conditionCode === 803) description = "broken clouds";
      else description = "overcast clouds";
      break;
    default:
      description = "unknown";
  }

  // Now use the same logic from the original file
  const condicaoLower = description.toLowerCase();

  if (
    condicaoLower.includes("rain") ||
    condicaoLower.includes("chuva") ||
    condicaoLower.includes("drizzle") ||
    description === "shower rain"
  ) {
    return {
      component: MaterialCommunityIcons,
      name: "weather-rainy",
      color: "#4287f5",
    };
  } else if (
    condicaoLower.includes("cloud") ||
    condicaoLower.includes("nublado") ||
    condicaoLower.includes("overcast")
  ) {
    if (
      condicaoLower.includes("few clouds") ||
      condicaoLower.includes("scattered clouds")
    ) {
      return {
        component: MaterialCommunityIcons,
        name: "weather-partly-cloudy",
        color: "#8c8c8c",
      };
    } else {
      return {
        component: MaterialCommunityIcons,
        name: "weather-cloudy",
        color: "#8c8c8c",
      };
    }
  } else if (
    condicaoLower.includes("storm") ||
    condicaoLower.includes("tempestade") ||
    condicaoLower.includes("thunder") ||
    condicaoLower.includes("lightning")
  ) {
    return {
      component: MaterialCommunityIcons,
      name: "weather-lightning",
      color: "#ffa600",
    };
  } else if (condicaoLower.includes("snow") || condicaoLower.includes("neve")) {
    return {
      component: MaterialCommunityIcons,
      name: "weather-snowy",
      color: "#bbd4ff",
    };
  } else if (
    condicaoLower.includes("clear") ||
    condicaoLower.includes("limpo") ||
    condicaoLower.includes("sunny") ||
    condicaoLower.includes("sol")
  ) {
    return {
      component: MaterialCommunityIcons,
      name: "weather-sunny",
      color: "#ffb300",
    };
  } else if (
    condicaoLower.includes("fog") ||
    condicaoLower.includes("neb") ||
    condicaoLower.includes("haze") ||
    condicaoLower.includes("mist")
  ) {
    return {
      component: MaterialCommunityIcons,
      name: "weather-fog",
      color: "#a9a9a9",
    };
  } else {
    return {
      component: MaterialCommunityIcons,
      name: "help-circle-outline",
      color: "#FFFFFF",
    };
  }
}

// Get gradient colors for forecast cards based on weather condition
function getForecastCardGradientColors(conditionCode) {
  // Convert condition code to a descriptive string
  const codeGroup = Math.floor(conditionCode / 100);
  let condicaoLower = "";

  switch (codeGroup) {
    case 2: // Thunderstorm
      condicaoLower = "storm";
      break;
    case 3: // Drizzle
      condicaoLower = "light rain";
      break;
    case 5: // Rain
      condicaoLower = "rain";
      break;
    case 6: // Snow
      condicaoLower = "snow";
      break;
    case 7: // Atmosphere (fog, mist, etc.)
      condicaoLower = "fog";
      break;
    case 8: // Clear or clouds
      if (conditionCode === 800) condicaoLower = "clear";
      else condicaoLower = "cloud";
      break;
    default:
      condicaoLower = "";
  }

  // Now use the same logic from the original file
  let colors = [
    "rgba(189, 195, 199, 0.5)", // Cinza claro padrão
    "rgba(236, 240, 241, 0.3)",
    "rgba(255, 255, 255, 0.2)",
  ];

  // Manhã ensolarada: Tons dourados quentes
  if (
    condicaoLower.includes("sun") ||
    condicaoLower.includes("sol") ||
    condicaoLower.includes("clear") ||
    condicaoLower.includes("limpo")
  ) {
    colors = [
      "rgba(241, 199, 31, 0.35)", // Amarelo dourado
      "rgba(250, 158, 9, 0.3)", // Laranja suave
      "rgba(255, 224, 178, 0.2)", // Pêssego claro
    ];
  }
  // Nublado: Tons de cinza prateado
  else if (
    condicaoLower.includes("cloud") ||
    condicaoLower.includes("nublado") ||
    condicaoLower.includes("overcast") ||
    condicaoLower.includes("encoberto")
  ) {
    colors = [
      "rgba(189, 195, 199, 0.5)", // Cinza claro
      "rgba(220, 220, 220, 0.3)", // Cinza prateado
      "rgba(245, 245, 245, 0.2)", // Cinza quase branco
    ];
  }
  // Chuva leve: Azul acinzentado suave
  else if (
    condicaoLower.includes("light rain") ||
    condicaoLower.includes("chuva fraca") ||
    condicaoLower.includes("drizzle") ||
    condicaoLower.includes("garoa")
  ) {
    colors = [
      "rgba(133, 146, 158, 0.5)", // Azul acinzentado claro
      "rgba(174, 182, 191, 0.3)", // Cinza azulado claro
      "rgba(214, 219, 223, 0.2)", // Cinza muito claro
    ];
  }
  // Chuva forte: Azul mais intenso
  else if (
    condicaoLower.includes("rain") ||
    condicaoLower.includes("chuva") ||
    condicaoLower.includes("shower") ||
    condicaoLower.includes("pouring")
  ) {
    colors = [
      "rgba(108, 122, 137, 0.5)", // Azul acinzentado
      "rgba(127, 143, 166, 0.3)", // Azul médio
      "rgba(174, 182, 191, 0.2)", // Cinza azulado claro
    ];
  }
  // Nevoeiro/Neblina: Tons muito claros e esbranquiçados
  else if (
    condicaoLower.includes("fog") ||
    condicaoLower.includes("neb") ||
    condicaoLower.includes("mist") ||
    condicaoLower.includes("hazy")
  ) {
    colors = [
      "rgba(220, 220, 220, 0.5)", // Cinza muito claro
      "rgba(236, 240, 241, 0.3)", // Branco neblina
      "rgba(245, 245, 245, 0.2)", // Quase branco
    ];
  }
  // Neve: Branco com toques de azul muito claro
  else if (
    condicaoLower.includes("snow") ||
    condicaoLower.includes("neve") ||
    condicaoLower.includes("sleet") ||
    condicaoLower.includes("freezing")
  ) {
    colors = [
      "rgba(236, 240, 241, 0.5)", // Branco neblina
      "rgba(214, 234, 248, 0.3)", // Azul muito claro
      "rgba(255, 255, 255, 0.2)", // Branco puro
    ];
  }
  // Tempestade: Cinza escuro com toques de roxo
  else if (
    condicaoLower.includes("storm") ||
    condicaoLower.includes("tempestade") ||
    condicaoLower.includes("thunder") ||
    condicaoLower.includes("lightning") ||
    condicaoLower.includes("trovão")
  ) {
    colors = [
      "rgba(61, 97, 133, 0.6)", // Azul petróleo escuro
      "rgba(76, 107, 136, 0.4)", // Cinza azulado médio
      "rgba(50, 90, 143, 0.2)", // Roxo acinzentado
    ];
  }

  return colors;
}

const diasSemanaAbrev = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];
function getDiaSemanaAbrev(timestamp) {
  const data = new Date(timestamp * 1000); // OpenWeather uses Unix timestamps
  return diasSemanaAbrev[data.getDay()];
}

export default function Index() {
  const OPENWEATHER_KEY = "18b550649fc5141a1e8ef7d8d8f479b0";

  //fonts para deixa bonitin
  let [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  //Lugar e a temperatura
  const [lugar, setLugar] = useState("Carregando...");
  const [temperatura, setTemperatura] = useState("--");

  //Pegar o tempo para saber se é dia ou noite
  const [tempNumber, setTempNumber] = useState(null);

  //Pegar a condicao do tempo
  const [condicao, setCondicao] = useState("");
  const [condicaoCode, setCondicaoCode] = useState(null);

  //localização como langitude e longitude
  const [localizacao, setLocation] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  //pegar o assent do fundo de parede
  const [fundo, setFundo] = useState(imagensClima.padrao);

  //texto para deixa mais profissional :)
  const [periodoTexto, setPeriodoTexto] = useState("Carregando...");

  //cores para o gradiente do card de previsão
  const [previsaoProximosDias, setPrevisaoProximosDias] = useState([]);
  const [forecastGradientColors, setForecastGradientColors] = useState([
    "rgba(171, 171, 172, 0.7)",
    "rgba(233, 233, 233, 0.4)",
    "rgba(122, 122, 122, 0.4)",
  ]);

  //useEffect para atualizar as cores do gradiente do card de previsão
  useEffect(() => {
    if (condicaoCode) {
      const newColors = getForecastCardGradientColors(condicaoCode);
      setForecastGradientColors(newColors);
    }
  }, [condicaoCode]); // Este efeito roda sempre que a 'condicaoCode' muda

  // --- useEffect para permissão e localização  ---
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão de localização não concedida.");
        return;
      }
      try {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.error("Erro ao obter localização:", error);
        setErrorMsg("Não foi possível obter a localização.");
        let lastKnown = await Location.getLastKnownPositionAsync({});
        if (lastKnown) {
          setLocation(lastKnown);
        } else {
          setErrorMsg(
            "Não foi possível obter a localização atual ou anterior."
          );
        }
      }
    })();
  }, []);

  // --- useEffect para buscar clima e previsão usando OpenWeather API ---
  useEffect(() => {
    if (!localizacao) return;

    async function fetchClima(lat, lon) {
      try {
        // Buscar clima atual
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=pt_br`;
        const currentWeatherResponse = await fetch(currentWeatherUrl);

        if (!currentWeatherResponse.ok) {
          throw new Error(
            `Erro na API de clima atual: ${currentWeatherResponse.status}`
          );
        }

        const currentWeatherData = await currentWeatherResponse.json();

        // Configurar dados do clima atual
        setLugar(currentWeatherData.name);
        setTemperatura(`${Math.round(currentWeatherData.main.temp)}`);
        setTempNumber(currentWeatherData.main.temp);
        setCondicao(currentWeatherData.weather[0].description);
        setCondicaoCode(currentWeatherData.weather[0].id);

        // Determinar o período do dia
        const horaAtual = new Date().getHours();
        const condicaoLower =
          currentWeatherData.weather[0].description.toLowerCase();

        if (condicaoLower.includes("rain") || condicaoLower.includes("chuva")) {
          setPeriodoTexto("Está chovendo");
        } else if (
          condicaoLower.includes("cloud") ||
          condicaoLower.includes("nublado")
        ) {
          setPeriodoTexto("Está nublado");
        } else if (
          condicaoLower.includes("snow") ||
          condicaoLower.includes("neve")
        ) {
          setPeriodoTexto("Está nevando");
        } else {
          if (horaAtual >= 6 && horaAtual < 12) {
            setPeriodoTexto("É de manhã");
          } else if (horaAtual >= 12 && horaAtual < 18) {
            setPeriodoTexto("Está ensolarado");
          } else {
            setPeriodoTexto("É noite");
          }
        }

        // Buscar previsão de 5 dias
        try {
          const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_KEY}&units=metric&lang=pt_br`;
          const forecastResponse = await fetch(forecastUrl);

          if (!forecastResponse.ok) {
            throw new Error(
              `Erro na API de previsão: ${forecastResponse.status}`
            );
          }

          const forecastData = await forecastResponse.json();

          // Processar dados de previsão para os próximos 5 dias
          // OpenWeather retorna previsões de 3 em 3 horas, precisamos filtrar para obter uma por dia
          const dailyForecasts = [];
          const processedDays = new Set();

          forecastData.list.forEach((item) => {
            const date = new Date(item.dt * 1000);
            const dayKey = date.toDateString();

            // Pegar apenas uma previsão por dia (meio-dia)
            if (
              !processedDays.has(dayKey) &&
              date.getHours() >= 12 &&
              date.getHours() <= 15
            ) {
              processedDays.add(dayKey);
              dailyForecasts.push({
                data: item.dt,
                diaSemana: getDiaSemanaAbrev(item.dt),
                tempMin: Math.round(item.main.temp_min),
                tempMax: Math.round(item.main.temp_max),
                condicaoDia: item.weather[0].description,
                condicaoCode: item.weather[0].id,
              });
            }
          });

          // Limitar a 5 dias
          setPrevisaoProximosDias(dailyForecasts.slice(0, 5));
        } catch (e) {
          console.error("Erro ao buscar previsão diária:", e);
          setErrorMsg("Erro ao buscar previsão diária.");
        }
      } catch (e) {
        console.error("Erro ao buscar dados do clima:", e);
        setErrorMsg(e.message || "Erro ao buscar dados do clima.");
      }
    }

    fetchClima(localizacao.coords.latitude, localizacao.coords.longitude);
  }, [localizacao]);

  // --- useEffect para atualizar background ---
  useEffect(() => {
    if (tempNumber === null || !condicao) return;
    const horaAgora = new Date().getHours();
    const imagem = getFoto(tempNumber, horaAgora, condicao);
    setFundo(imagem);
  }, [tempNumber, condicao]);

  // --- Renderização (Loading/Error) ---
  if (errorMsg) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  if (!fontsLoaded || !localizacao) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <>
      {/* Adicione esta linha para configurar a tela atual do Stack */}
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.mainContainer}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="light-content"
        />
        <ImageBackground
          source={fundo}
          style={styles.background}
          resizeMode="cover"
        >
          <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.header}>
              <View style={styles.leftHeaderContainer}>
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={16} color="white" />
                  <Text style={styles.location}>{lugar}</Text>
                </View>
                <Text style={styles.gradientTemperatureText}>
                  {temperatura}°
                </Text>
              </View>
              <View style={styles.rightHeaderContainer}>
                <Text style={styles.weatherStatusRotated}>{periodoTexto}</Text>
              </View>
            </View>

            {/* Card de previsão */}
            <LinearGradient
              colors={forecastGradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.forecastCard}
            >
              <Text style={styles.forecastTitle}>Próximos 5 dias</Text>
              <View style={styles.forecastContainer}>
                {previsaoProximosDias.map((dia, index) => {
                  const iconInfo = getWeatherIcon(dia.condicaoCode);
                  const IconComponent = iconInfo.component;
                  return (
                    <View key={index} style={styles.forecastItem}>
                      <IconComponent
                        name={iconInfo.name}
                        size={28}
                        color="#FFFFFF" // Manteve a cor branca aqui, ajuste se necessário
                        style={styles.forecastIcon}
                      />
                      <View style={styles.forecastTempContainer}>
                        <Text
                          style={styles.forecastTempMax}
                        >{`${dia.tempMax}°`}</Text>
                        <Text
                          style={styles.forecastTempMin}
                        >{`${dia.tempMin}°`}</Text>
                      </View>
                      <Text style={styles.forecastDay}>{dia.diaSemana}</Text>
                    </View>
                  );
                })}
              </View>
            </LinearGradient>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 60,
    paddingHorizontal: 20,
    backgroundColor: "#000", // Fundo preto para telas de carregamento e erro
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  error: {
    color: "red",
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },

  loadingText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    marginLeft: 10,
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  leftHeaderContainer: {
    flex: 1,
    justifyContent: "center",
  },

  rightHeaderContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 10,
  },

  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: -25,
  },

  location: {
    color: "white",
    fontSize: 25,
    fontFamily: "Poppins_500Medium",
    marginLeft: 10,
  },

  gradientTemperatureText: {
    fontSize: 120,
    fontFamily: "Poppins_600SemiBold",
    color: "rgba(255, 255, 255, 0.8)",
  },

  weatherStatusRotated: {
    color: "white",
    fontSize: 20,
    fontFamily: "Poppins_400Regular",
    marginRight: -35,
    opacity: 0.8,
    transform: [{ rotate: "270deg" }],
  },

  forecastCard: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20, // Aumentar o padding inferior no iOS
    backgroundColor: "transparent",
  },

  forecastTitle: {
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 15,
    color: "white",
  },

  forecastContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  forecastItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 5,
  },

  forecastIcon: {
    marginBottom: 8,
  },

  forecastTempContainer: {
    alignItems: "center",
    marginBottom: 8,
  },

  forecastTempMax: {
    fontSize: 18,
    fontFamily: "Poppins_600SemiBold",
    color: "white",
  },
  forecastTempMin: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  forecastDay: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: "rgba(255, 255, 255, 0.9)",
    textTransform: "uppercase",
  },
});
