import styled from 'styled-components/native'

export const Container = styled.View`
    flex: 1;
    padding-left: 20px;
    padding-right: 20px;
    align-items: center;
    background-color: #ffffff;
`

export const Card = styled.TouchableOpacity`
    width: 100%;
`

export const UserInfo = styled.View`
    flex-direction: row;
`

export const UserImgWrapper = styled.View`
    padding-top: 15px;
    padding-bottom: 15px;
    padding-left: 20px;
`

export const UserImg = styled.Image`
    width: 50px;
    height: 50px;
    border-radius: 25px;
`

export const TextSection = styled.View`
    flex-direction: column;
    justify-content: center;
    padding: 15px;
    width: 300px;
    border-bottom-width: 1px;
    border-bottom-color: #cccccc;
`

export const UserInfoText = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 5px;
    padding-right: 20px;
`

export const UserName = styled.Text`
    font-size: 18px;
    font-weight: bold;
`

export const PostTime = styled.Text`
    font-size: 12px;
    color: #666;
`

export const MessageText = styled.Text`
    font-size: 14px;
    color: #333333;
`
