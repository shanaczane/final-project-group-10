import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import type { Product } from '../../types';
import { createStyles } from './productdetailmodal.style';

function stockStatus(product: Product): 'red' | 'amber' | 'green' {
  if (product.quantity <= product.min_threshold) return 'red';
  if (product.quantity <= product.min_threshold * 2) return 'amber';
  return 'green';
}

interface InfoRowProps {
  label: string;
  value: string;
  styles: ReturnType<typeof createStyles>;
}

function InfoRow({ label, value, styles }: InfoRowProps): React.JSX.Element {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

interface ProductDetailModalProps {
  product: Product | null;
  visible: boolean;
  isOwner: boolean;
  onClose: () => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  visible,
  isOwner,
  onClose,
  onEdit,
  onDelete,
}: ProductDetailModalProps): React.JSX.Element {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  if (!product) return <></>;

  const status = stockStatus(product);
  const profit = product.sell_price - product.buy_price;
  const margin = product.buy_price > 0
    ? ((profit / product.buy_price) * 100).toFixed(1)
    : '0.0';

  const statusLabel = status === 'red' ? 'Low Stock' : status === 'amber' ? 'Warning' : 'In Stock';
  const statusStyle =
    status === 'red' ? styles.statusRed :
    status === 'amber' ? styles.statusAmber :
    styles.statusGreen;
  const statusTextStyle =
    status === 'red' ? styles.statusTextRed :
    status === 'amber' ? styles.statusTextAmber :
    styles.statusTextGreen;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Status badge */}
          <View style={[styles.statusBadge, statusStyle]}>
            <Text style={[styles.statusText, statusTextStyle]}>{statusLabel}</Text>
          </View>

          {/* Stock highlight card */}
          <View style={styles.stockCard}>
            <View style={styles.stockItem}>
              <Text style={styles.stockValue}>{product.quantity}</Text>
              <Text style={styles.stockLabel}>In Stock</Text>
            </View>
            <View style={styles.stockDivider} />
            <View style={styles.stockItem}>
              <Text style={styles.stockValue}>{product.min_threshold}</Text>
              <Text style={styles.stockLabel}>Min Threshold</Text>
            </View>
            <View style={styles.stockDivider} />
            <View style={styles.stockItem}>
              <Text style={[styles.stockValue, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                {margin}%
              </Text>
              <Text style={styles.stockLabel}>Margin</Text>
            </View>
          </View>

          {/* Details */}
          <View style={styles.detailsCard}>
            <InfoRow
              label="Category"
              value={product.category?.name ?? 'Uncategorized'}
              styles={styles}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Buy Price"
              value={`₱${product.buy_price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
              styles={styles}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Sell Price"
              value={`₱${product.sell_price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
              styles={styles}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Profit per Unit"
              value={`₱${profit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
              styles={styles}
            />
            <View style={styles.divider} />
            <InfoRow
              label="Total Stock Value"
              value={`₱${(product.sell_price * product.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`}
              styles={styles}
            />
          </View>

          {/* Owner actions */}
          {isOwner && (
            <View style={styles.actions}>
              <Pressable
                style={styles.editBtn}
                onPress={() => { onClose(); onEdit(product); }}
              >
                <Ionicons name="pencil-outline" size={18} color="#fff" />
                <Text style={styles.editBtnText}>Edit Product</Text>
              </Pressable>
              <Pressable
                style={styles.deleteBtn}
                onPress={() => { onClose(); onDelete(product); }}
              >
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
                <Text style={styles.deleteBtnText}>Delete</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
