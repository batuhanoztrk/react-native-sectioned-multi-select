import React, { Component } from 'react'
import isEqual from 'lodash.isequal'
import { View, TouchableOpacity, Text } from 'react-native'
import ItemIcon from './ItemIcon'
import { callIfFunction } from '../helpers'

class RowSubItem extends Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.selectedItems !== this.props.selectedItems) {
      if (
        this.props.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        ) &&
        !nextProps.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        )
      ) {
        return true
      }
      if (
        !this.props.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        ) &&
        nextProps.selectedItems.includes(
          this.props.subItem[this.props.uniqueKey]
        )
      ) {
        return true
      }
      if (this.props.highlightChildren || this.props.selectChildren) {
        if (
          this.props.highlightedChildren.includes(
            this.props.subItem[this.props.uniqueKey]
          )
        ) {
          return true
        }
        if (
          nextProps.highlightedChildren.includes(
            this.props.subItem[this.props.uniqueKey]
          )
        ) {
          return true
        }
      }
    }
    if (!isEqual(this.props.mergedStyles, nextProps.mergedStyles)) {
      return true
    }
    if (!isEqual(this.props.mergedColors, nextProps.mergedColors)) {
      return true
    }
    return false
  }

  _itemSelected = () => {
    const { subItem, uniqueKey, selectedItems } = this.props
    return selectedItems.includes(subItem[uniqueKey])
  }

  _toggleItem = () => {
    const { subItem } = this.props
    this.props.toggleSubItem(subItem)
  }

  _renderSelectedIcon = () => {
    const {
      selectedIconComponent,
      unselectedIconComponent,
      mergedColors,
      selectChildren,
      highlightedChildren,
      uniqueKey,
      subItem,
      icons,
      iconRenderer: Icon
    } = this.props
    const highlightChild =
      !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()
    return itemSelected || highlightChild ? (
      <View>
        {selectedIconComponent ? (
          callIfFunction(selectedIconComponent)
        ) : (
          <Icon
            style={{
              color: highlightChild
                ? mergedColors.disabled
                : mergedColors.success,
              paddingLeft: 10
            }}
            {...icons.check}
          />
        )}
      </View>
    ) : unselectedIconComponent ? (
      callIfFunction(unselectedIconComponent)
    ) : null
  }

  render() {
    const {
      mergedStyles,
      mergedColors,
      subItem,
      uniqueKey,
      subItemFontFamily,
      selectChildren,
      selectedIconOnLeft,
      highlightedChildren,
      itemNumberOfLines,
      displayKey,
      iconKey,
      iconRenderer: Icon,
      subItemLabelComponent
    } = this.props

    const highlightChild =
      !selectChildren && highlightedChildren.includes(subItem[uniqueKey])
    const itemSelected = this._itemSelected()

    return (
      <View
        key={subItem[uniqueKey]}
        style={{
          flexDirection: 'row',
          flex: 1,
          backgroundColor: mergedColors.subItemBackground
        }}
      >
        <TouchableOpacity
          disabled={highlightChild || subItem.disabled}
          onPress={this._toggleItem}
          style={[
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingVertical: 6
            },
            mergedStyles.subItem,
            (itemSelected || highlightChild) && mergedStyles.selectedItem,
            (itemSelected || highlightChild) && mergedStyles.selectedSubItem
          ]}
        >
          {selectedIconOnLeft && this._renderSelectedIcon()}

          {iconKey && subItem[iconKey] && (
            <ItemIcon
              iconRenderer={Icon}
              iconKey={iconKey}
              icon={subItem[iconKey]}
              style={mergedStyles.itemIconStyle}
            />
          )}

          {subItemLabelComponent ? (
            subItemLabelComponent(
              subItem[displayKey],
              (label = subItem[displayKey]) => (
                <Text
                  numberOfLines={itemNumberOfLines}
                  style={[
                    {
                      flex: 1,
                      color: subItem.disabled
                        ? mergedColors.disabled
                        : mergedColors.subText
                    },
                    subItemFontFamily,
                    mergedStyles.subItemText,
                    (itemSelected || highlightChild) &&
                      mergedStyles.selectedSubItemText
                  ]}
                >
                  {label}
                </Text>
              )
            )
          ) : (
            <Text
              numberOfLines={itemNumberOfLines}
              style={[
                {
                  flex: 1,
                  color: subItem.disabled
                    ? mergedColors.disabled
                    : mergedColors.subText
                },
                subItemFontFamily,
                mergedStyles.subItemText,
                (itemSelected || highlightChild) &&
                  mergedStyles.selectedSubItemText
              ]}
            >
              {subItem[displayKey]}
            </Text>
          )}

          {!selectedIconOnLeft && this._renderSelectedIcon()}
        </TouchableOpacity>
      </View>
    )
  }
}

export default RowSubItem
