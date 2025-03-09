import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import ClearHistoryModalStyles from "../styles/ClearHistoryModalStyles";

interface ClearHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ClearHistoryModal: React.FC<ClearHistoryModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={ClearHistoryModalStyles.centeredView}>
        <View style={ClearHistoryModalStyles.modalView}>
          <Text style={ClearHistoryModalStyles.titleText}>Are you sure ?</Text>

          <Text style={ClearHistoryModalStyles.warningText}>
            THIS DELETION IS PERMANENT
          </Text>

          <TouchableOpacity
            style={ClearHistoryModalStyles.confirmButton}
            onPress={onConfirm}
          >
            <Text style={ClearHistoryModalStyles.confirmButtonText}>
              Clear History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ClearHistoryModal;












