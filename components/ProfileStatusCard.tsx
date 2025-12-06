import React from 'react';
import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProfileStatusCardProps {
  isVerified: boolean;
  completionPercentage: number;
}

const ProfileStatusCard: React.FC<ProfileStatusCardProps> = ({ isVerified, completionPercentage }) => {
return (
    <View style={{
      width: 396,
      height: 126,
      marginTop: 32,
      marginLeft: 20,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#16423C',
      backgroundColor: '#FFFFFF',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      justifyContent: 'space-between',
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 12,
          color: isVerified ? '#4CAF50' : '#FF9800',
          fontWeight: '500',
          marginBottom: 8,
        }}>
          {isVerified ? 'Profile Verified ✓' : 'Profile Under Verification'}
        </Text>
        
        <Text style={{
          fontSize: 14,
          color: '#333333',
          fontWeight: '600',
          lineHeight: 20,
        }}>
          {completionPercentage === 100 
            ? 'Congratulations! Your profile is updated' 
            : 'Complete your profile & Get more chance to earn'
          }
        </Text>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ position: 'relative' }}>
          <Svg width={90} height={90}>
            <Circle
              cx={45}
              cy={45}
              r={38}
              stroke="#E0E0E0"
              strokeWidth={8}
              fill="transparent"
            />
            <Circle
              cx={45}
              cy={45}
              r={38}
              stroke="#16423C"
              strokeWidth={8}
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 38}`}
              strokeDashoffset={`${2 * Math.PI * 38 * (1 - completionPercentage / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 45 45)"
            />
          </Svg>
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: '#333333',
            }}>
              {completionPercentage}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileStatusCard;