import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Animated, Alert } from 'react-native';
import { supabase } from '../../api/supabase';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import * as d3Shape from 'd3-shape';

const rewards = [
    { label: 'Hai vinto 10 punti', points: 10 },
    { label: 'Non hai vinto', points: 0 },
    { label: 'Hai vinto 20 punti', points: 20 },
    { label: 'Non hai vinto', points: 0 },
    { label: 'Hai vinto 10 punti', points: 10 },
    { label: 'Hai vinto 50 punti', points: 50 },
    { label: 'Non hai vinto', points: 0 },
    { label: 'Hai vinto 20 punti', points: 20 }
];

export default function LuckyWheel({ profile, refreshProfile }) {
    const [rotation] = useState(new Animated.Value(0));
    const [canSpin, setCanSpin] = useState(false);
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState(null);

    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        if (profile?.last_spin_date !== today) {
            setCanSpin(true);
        }
    }, [profile]);

    const spinWheel = () => {
        if (!canSpin || spinning) return;

        const winnerIndex = Math.floor(Math.random() * rewards.length);
        const sliceAngle = 360 / rewards.length;
        const spinAngle = 360 * 5 + (360 - (winnerIndex * sliceAngle) - sliceAngle / 2);

        setSpinning(true);
        setResult(null);

        Animated.timing(rotation, {
            toValue: spinAngle,
            duration: 3000,
            useNativeDriver: true
        }).start(async () => {
            const reward = rewards[winnerIndex];

            const { error } = await supabase
                .from('profiles')
                .update({
                    points: profile.points + reward.points,
                    last_spin_date: today
                })
                .eq('id', profile.id);

            if (error) {
                Alert.alert('Errore', 'Impossibile aggiornare i punti.');
            } else {
                setResult(reward.label);
                await refreshProfile();
                setCanSpin(false);
            }

            setSpinning(false);
            // rotation.setValue(0); // opzionale: se vuoi che la ruota resti ferma
        });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🎡 Ruota della Fortuna</Text>

            {/* Indicatore in alto */}
            <View style={styles.pointer} />

            <Animated.View
                style={{
                    transform: [
                        {
                            rotate: rotation.interpolate({
                                inputRange: [0, 360],
                                outputRange: ['0deg', '360deg']
                            })
                        }
                    ]
                }}
            >
                <Svg width={300} height={300} viewBox="0 0 300 300">
                    <G x={150} y={150}>
                        {generateSlices(rewards)}
                    </G>
                </Svg>
            </Animated.View>

            <Button
                title="Gira la ruota"
                onPress={spinWheel}
                disabled={!canSpin || spinning}
            />

            {result && <Text style={styles.resultText}>{result}</Text>}

            {!canSpin && !spinning && !result && (
                <Text style={styles.infoText}>Hai già girato oggi. Torna domani!</Text>
            )}
        </View>
    );
}

function generateSlices() {
    const arcs = d3Shape.pie().value(() => 1)(rewards);
    const arcGenerator = d3Shape.arc().outerRadius(140).innerRadius(0);
    const colors = ['#FFA07A', '#20B2AA', '#87CEFA', '#FFB6C1', '#90EE90', '#DDA0DD', '#FFD700', '#CD5C5C'];

    return arcs.map((arc, i) => {
        const path = arcGenerator(arc);
        const [labelX, labelY] = arcGenerator.centroid(arc);

        const isLost = rewards[i].points === 0;
        const shortLabel = isLost ? 'Hai perso' : `+${rewards[i].points}`;

        const angle = ((arc.startAngle + arc.endAngle) / 2) * (180 / Math.PI); // centro angolo

        return (
            <G key={`arc-${i}`}>
                <Path d={path} fill={colors[i % colors.length]} stroke="#fff" strokeWidth={2} />
                <SvgText
                    x={labelX}
                    y={labelY - 5}
                    fill="#000"
                    fontSize={isLost ? 12 : 16}
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={`rotate(${angle}, ${labelX}, ${labelY})`}
                >
                    {shortLabel}
                </SvgText>
            </G>
        );
    });
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 100,
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20
    },
    pointer: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'red',
        marginBottom: -10,
        zIndex: 1
    },
    resultText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600'
    },
    infoText: {
        marginTop: 20,
        fontSize: 14,
        fontStyle: 'italic',
        color: '#888'
    }
});
