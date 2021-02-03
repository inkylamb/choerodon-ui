// @ts-nocheck
/* eslint-disable */
import warning from 'rc-util/lib/warning';
function removeFromCheckedKeys(halfCheckedKeys, checkedKeys) {
    const filteredKeys = new Set();
    halfCheckedKeys.forEach(key => {
        if (!checkedKeys.has(key)) {
            filteredKeys.add(key);
        }
    });
    return filteredKeys;
}
export function isCheckDisabled(node) {
    const { disabled, disableCheckbox, checkable } = (node || {});
    return !!(disabled || disableCheckbox) || checkable === false;
}
// Fill miss keys
function fillConductCheck(keys, levelEntities, maxLevel) {
    const checkedKeys = new Set(keys);
    const halfCheckedKeys = new Set();
    // Add checked keys top to bottom
    for (let level = 0; level <= maxLevel; level += 1) {
        const entities = levelEntities.get(level) || new Set();
        entities.forEach(entity => {
            const { key, node, children = [] } = entity;
            if (checkedKeys.has(key) && !isCheckDisabled(node)) {
                children
                    .filter(childEntity => !isCheckDisabled(childEntity.node))
                    .forEach(childEntity => {
                    checkedKeys.add(childEntity.key);
                });
            }
        });
    }
    // Add checked keys from bottom to top
    const visitedKeys = new Set();
    for (let level = maxLevel; level >= 0; level -= 1) {
        const entities = levelEntities.get(level) || new Set();
        entities.forEach(entity => {
            const { parent, node } = entity;
            // Skip if no need to check
            if (isCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
                return;
            }
            // Skip if parent is disabled
            if (isCheckDisabled(entity.parent.node)) {
                visitedKeys.add(parent.key);
                return;
            }
            let allChecked = true;
            let partialChecked = false;
            (parent.children || [])
                .filter(childEntity => !isCheckDisabled(childEntity.node))
                .forEach(({ key }) => {
                const checked = checkedKeys.has(key);
                if (allChecked && !checked) {
                    allChecked = false;
                }
                if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
                    partialChecked = true;
                }
            });
            if (allChecked) {
                checkedKeys.add(parent.key);
            }
            if (partialChecked) {
                halfCheckedKeys.add(parent.key);
            }
            visitedKeys.add(parent.key);
        });
    }
    return {
        checkedKeys: Array.from(checkedKeys),
        halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
    };
}
// Remove useless key
function cleanConductCheck(keys, halfKeys, levelEntities, maxLevel) {
    const checkedKeys = new Set(keys);
    let halfCheckedKeys = new Set(halfKeys);
    // Remove checked keys from top to bottom
    for (let level = 0; level <= maxLevel; level += 1) {
        const entities = levelEntities.get(level) || new Set();
        entities.forEach(entity => {
            const { key, node, children = [] } = entity;
            if (!checkedKeys.has(key) && !halfCheckedKeys.has(key) && !isCheckDisabled(node)) {
                children
                    .filter(childEntity => !isCheckDisabled(childEntity.node))
                    .forEach(childEntity => {
                    checkedKeys.delete(childEntity.key);
                });
            }
        });
    }
    // Remove checked keys form bottom to top
    halfCheckedKeys = new Set();
    const visitedKeys = new Set();
    for (let level = maxLevel; level >= 0; level -= 1) {
        const entities = levelEntities.get(level) || new Set();
        entities.forEach(entity => {
            const { parent, node } = entity;
            // Skip if no need to check
            if (isCheckDisabled(node) || !entity.parent || visitedKeys.has(entity.parent.key)) {
                return;
            }
            // Skip if parent is disabled
            if (isCheckDisabled(entity.parent.node)) {
                visitedKeys.add(parent.key);
                return;
            }
            let allChecked = true;
            let partialChecked = false;
            (parent.children || [])
                .filter(childEntity => !isCheckDisabled(childEntity.node))
                .forEach(({ key }) => {
                const checked = checkedKeys.has(key);
                if (allChecked && !checked) {
                    allChecked = false;
                }
                if (!partialChecked && (checked || halfCheckedKeys.has(key))) {
                    partialChecked = true;
                }
            });
            if (!allChecked) {
                checkedKeys.delete(parent.key);
            }
            if (partialChecked) {
                halfCheckedKeys.add(parent.key);
            }
            visitedKeys.add(parent.key);
        });
    }
    return {
        checkedKeys: Array.from(checkedKeys),
        halfCheckedKeys: Array.from(removeFromCheckedKeys(halfCheckedKeys, checkedKeys)),
    };
}
/**
 * Conduct with keys.
 * @param keyList current key list
 * @param keyEntities key - dataEntity map
 * @param mode `fill` to fill missing key, `clean` to remove useless key
 */
export function conductCheck(keyList, checked, keyEntities) {
    const warningMissKeys = [];
    // We only handle exist keys
    const keys = new Set(keyList.filter(key => {
        const hasEntity = !!keyEntities[key];
        if (!hasEntity) {
            warningMissKeys.push(key);
        }
        return hasEntity;
    }));
    const levelEntities = new Map();
    let maxLevel = 0;
    // Convert entities by level for calculation
    Object.keys(keyEntities).forEach(key => {
        const entity = keyEntities[key];
        const { level } = entity;
        let levelSet = levelEntities.get(level);
        if (!levelSet) {
            levelSet = new Set();
            levelEntities.set(level, levelSet);
        }
        levelSet.add(entity);
        maxLevel = Math.max(maxLevel, level);
    });
    warning(!warningMissKeys.length, `Tree missing follow keys: ${warningMissKeys
        .slice(0, 100)
        .map(key => `'${key}'`)
        .join(', ')}`);
    let result;
    if (checked === true) {
        result = fillConductCheck(keys, levelEntities, maxLevel);
    }
    else {
        result = cleanConductCheck(keys, checked.halfCheckedKeys, levelEntities, maxLevel);
    }
    return result;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJmaWxlIjoiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvcmMtY29tcG9uZW50cy90cmVlL3V0aWxzL2NvbmR1Y3RVdGlsLnRzIiwibWFwcGluZ3MiOiJBQUFBLGNBQWM7QUFDZCxvQkFBb0I7QUFDcEIsT0FBTyxPQUFPLE1BQU0scUJBQXFCLENBQUM7QUFRMUMsU0FBUyxxQkFBcUIsQ0FBQyxlQUF5QixFQUFFLFdBQXFCO0lBQzdFLE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7SUFDcEMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM1QixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QixZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLFlBQVksQ0FBQztBQUN0QixDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUFjO0lBQzVDLE1BQU0sRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLFNBQVMsRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBYSxDQUFDO0lBQzFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUFJLGVBQWUsQ0FBQyxJQUFJLFNBQVMsS0FBSyxLQUFLLENBQUM7QUFDaEUsQ0FBQztBQUVELGlCQUFpQjtBQUNqQixTQUFTLGdCQUFnQixDQUN2QixJQUFjLEVBQ2QsYUFBMkMsRUFDM0MsUUFBZ0I7SUFFaEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLENBQU0sSUFBSSxDQUFDLENBQUM7SUFDdkMsTUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQU8sQ0FBQztJQUV2QyxpQ0FBaUM7SUFDakMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ2pELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN2RCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFNUMsSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsRCxRQUFRO3FCQUNMLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDekQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNyQixXQUFXLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbkMsQ0FBQyxDQUFDLENBQUM7YUFDTjtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxzQ0FBc0M7SUFDdEMsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQU8sQ0FBQztJQUNuQyxLQUFLLElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDakQsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ3ZELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFaEMsMkJBQTJCO1lBQzNCLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pGLE9BQU87YUFDUjtZQUVELDZCQUE2QjtZQUM3QixJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNSO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUUzQixDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO2lCQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pELE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsSUFBSSxVQUFVLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQzFCLFVBQVUsR0FBRyxLQUFLLENBQUM7aUJBQ3BCO2dCQUNELElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUM1RCxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN2QjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUwsSUFBSSxVQUFVLEVBQUU7Z0JBQ2QsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDN0I7WUFDRCxJQUFJLGNBQWMsRUFBRTtnQkFDbEIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakM7WUFFRCxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztLQUNKO0lBRUQsT0FBTztRQUNMLFdBQVcsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNwQyxlQUFlLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsV0FBVyxDQUFDLENBQUM7S0FDakYsQ0FBQztBQUNKLENBQUM7QUFFRCxxQkFBcUI7QUFDckIsU0FBUyxpQkFBaUIsQ0FDeEIsSUFBYyxFQUNkLFFBQWUsRUFDZixhQUEyQyxFQUMzQyxRQUFnQjtJQUVoQixNQUFNLFdBQVcsR0FBRyxJQUFJLEdBQUcsQ0FBTSxJQUFJLENBQUMsQ0FBQztJQUN2QyxJQUFJLGVBQWUsR0FBRyxJQUFJLEdBQUcsQ0FBTSxRQUFRLENBQUMsQ0FBQztJQUU3Qyx5Q0FBeUM7SUFDekMsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFO1FBQ2pELE1BQU0sUUFBUSxHQUFHLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUN2RCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ3hCLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFFBQVEsR0FBRyxFQUFFLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNoRixRQUFRO3FCQUNMLE1BQU0sQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDekQsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO29CQUNyQixXQUFXLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEMsQ0FBQyxDQUFDLENBQUM7YUFDTjtRQUNILENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCx5Q0FBeUM7SUFDekMsZUFBZSxHQUFHLElBQUksR0FBRyxFQUFPLENBQUM7SUFDakMsTUFBTSxXQUFXLEdBQUcsSUFBSSxHQUFHLEVBQU8sQ0FBQztJQUNuQyxLQUFLLElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxLQUFLLElBQUksQ0FBQyxFQUFFLEtBQUssSUFBSSxDQUFDLEVBQUU7UUFDakQsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRXZELFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDeEIsTUFBTSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUM7WUFFaEMsMkJBQTJCO1lBQzNCLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ2pGLE9BQU87YUFDUjtZQUVELDZCQUE2QjtZQUM3QixJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN2QyxXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDNUIsT0FBTzthQUNSO1lBRUQsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksY0FBYyxHQUFHLEtBQUssQ0FBQztZQUUzQixDQUFDLE1BQU0sQ0FBQyxRQUFRLElBQUksRUFBRSxDQUFDO2lCQUNwQixNQUFNLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pELE9BQU8sQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRTtnQkFDbkIsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckMsSUFBSSxVQUFVLElBQUksQ0FBQyxPQUFPLEVBQUU7b0JBQzFCLFVBQVUsR0FBRyxLQUFLLENBQUM7aUJBQ3BCO2dCQUNELElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxPQUFPLElBQUksZUFBZSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUM1RCxjQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN2QjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUwsSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDZixXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNoQztZQUNELElBQUksY0FBYyxFQUFFO2dCQUNsQixlQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQztZQUVELFdBQVcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxPQUFPO1FBQ0wsV0FBVyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3BDLGVBQWUsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGVBQWUsRUFBRSxXQUFXLENBQUMsQ0FBQztLQUNqRixDQUFDO0FBQ0osQ0FBQztBQUVEOzs7OztHQUtHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDMUIsT0FBYyxFQUNkLE9BQTBELEVBQzFELFdBQW9DO0lBRXBDLE1BQU0sZUFBZSxHQUFVLEVBQUUsQ0FBQztJQUVsQyw0QkFBNEI7SUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQ2xCLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDbkIsTUFBTSxTQUFTLEdBQUcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2QsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDRixNQUFNLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBMkIsQ0FBQztJQUN6RCxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFFakIsNENBQTRDO0lBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3JDLE1BQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBRXpCLElBQUksUUFBUSxHQUFvQixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDYixRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNyQixhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNwQztRQUVELFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFckIsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxDQUNMLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFDdkIsNkJBQTZCLGVBQWU7U0FDekMsS0FBSyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUM7U0FDYixHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO1NBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNoQixDQUFDO0lBRUYsSUFBSSxNQUF5QixDQUFDO0lBQzlCLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtRQUNwQixNQUFNLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUMxRDtTQUFNO1FBQ0wsTUFBTSxHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNwRjtJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2hCLENBQUMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiL1VzZXJzL2h1aWh1YXdrL0RvY3VtZW50cy9vcHQvY2hvZXJvZG9uLXVpL2NvbXBvbmVudHMvcmMtY29tcG9uZW50cy90cmVlL3V0aWxzL2NvbmR1Y3RVdGlsLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1ub2NoZWNrXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuaW1wb3J0IHdhcm5pbmcgZnJvbSAncmMtdXRpbC9saWIvd2FybmluZyc7XG5pbXBvcnQgeyBLZXksIERhdGFFbnRpdHksIERhdGFOb2RlIH0gZnJvbSAnLi4vaW50ZXJmYWNlJztcblxuaW50ZXJmYWNlIENvbmR1Y3RSZXR1cm5UeXBlIHtcbiAgY2hlY2tlZEtleXM6IEtleVtdO1xuICBoYWxmQ2hlY2tlZEtleXM6IEtleVtdO1xufVxuXG5mdW5jdGlvbiByZW1vdmVGcm9tQ2hlY2tlZEtleXMoaGFsZkNoZWNrZWRLZXlzOiBTZXQ8S2V5PiwgY2hlY2tlZEtleXM6IFNldDxLZXk+KSB7XG4gIGNvbnN0IGZpbHRlcmVkS2V5cyA9IG5ldyBTZXQ8S2V5PigpO1xuICBoYWxmQ2hlY2tlZEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICghY2hlY2tlZEtleXMuaGFzKGtleSkpIHtcbiAgICAgIGZpbHRlcmVkS2V5cy5hZGQoa2V5KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyZWRLZXlzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGVja0Rpc2FibGVkKG5vZGU6IERhdGFOb2RlKSB7XG4gIGNvbnN0IHsgZGlzYWJsZWQsIGRpc2FibGVDaGVja2JveCwgY2hlY2thYmxlIH0gPSAobm9kZSB8fCB7fSkgYXMgRGF0YU5vZGU7XG4gIHJldHVybiAhIShkaXNhYmxlZCB8fCBkaXNhYmxlQ2hlY2tib3gpIHx8IGNoZWNrYWJsZSA9PT0gZmFsc2U7XG59XG5cbi8vIEZpbGwgbWlzcyBrZXlzXG5mdW5jdGlvbiBmaWxsQ29uZHVjdENoZWNrKFxuICBrZXlzOiBTZXQ8S2V5PixcbiAgbGV2ZWxFbnRpdGllczogTWFwPG51bWJlciwgU2V0PERhdGFFbnRpdHk+PixcbiAgbWF4TGV2ZWw6IG51bWJlcixcbik6IENvbmR1Y3RSZXR1cm5UeXBlIHtcbiAgY29uc3QgY2hlY2tlZEtleXMgPSBuZXcgU2V0PEtleT4oa2V5cyk7XG4gIGNvbnN0IGhhbGZDaGVja2VkS2V5cyA9IG5ldyBTZXQ8S2V5PigpO1xuXG4gIC8vIEFkZCBjaGVja2VkIGtleXMgdG9wIHRvIGJvdHRvbVxuICBmb3IgKGxldCBsZXZlbCA9IDA7IGxldmVsIDw9IG1heExldmVsOyBsZXZlbCArPSAxKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSBsZXZlbEVudGl0aWVzLmdldChsZXZlbCkgfHwgbmV3IFNldCgpO1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IHsga2V5LCBub2RlLCBjaGlsZHJlbiA9IFtdIH0gPSBlbnRpdHk7XG5cbiAgICAgIGlmIChjaGVja2VkS2V5cy5oYXMoa2V5KSAmJiAhaXNDaGVja0Rpc2FibGVkKG5vZGUpKSB7XG4gICAgICAgIGNoaWxkcmVuXG4gICAgICAgICAgLmZpbHRlcihjaGlsZEVudGl0eSA9PiAhaXNDaGVja0Rpc2FibGVkKGNoaWxkRW50aXR5Lm5vZGUpKVxuICAgICAgICAgIC5mb3JFYWNoKGNoaWxkRW50aXR5ID0+IHtcbiAgICAgICAgICAgIGNoZWNrZWRLZXlzLmFkZChjaGlsZEVudGl0eS5rZXkpO1xuICAgICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gQWRkIGNoZWNrZWQga2V5cyBmcm9tIGJvdHRvbSB0byB0b3BcbiAgY29uc3QgdmlzaXRlZEtleXMgPSBuZXcgU2V0PEtleT4oKTtcbiAgZm9yIChsZXQgbGV2ZWwgPSBtYXhMZXZlbDsgbGV2ZWwgPj0gMDsgbGV2ZWwgLT0gMSkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gbGV2ZWxFbnRpdGllcy5nZXQobGV2ZWwpIHx8IG5ldyBTZXQoKTtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCB7IHBhcmVudCwgbm9kZSB9ID0gZW50aXR5O1xuXG4gICAgICAvLyBTa2lwIGlmIG5vIG5lZWQgdG8gY2hlY2tcbiAgICAgIGlmIChpc0NoZWNrRGlzYWJsZWQobm9kZSkgfHwgIWVudGl0eS5wYXJlbnQgfHwgdmlzaXRlZEtleXMuaGFzKGVudGl0eS5wYXJlbnQua2V5KSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIFNraXAgaWYgcGFyZW50IGlzIGRpc2FibGVkXG4gICAgICBpZiAoaXNDaGVja0Rpc2FibGVkKGVudGl0eS5wYXJlbnQubm9kZSkpIHtcbiAgICAgICAgdmlzaXRlZEtleXMuYWRkKHBhcmVudC5rZXkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGxldCBhbGxDaGVja2VkID0gdHJ1ZTtcbiAgICAgIGxldCBwYXJ0aWFsQ2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICAocGFyZW50LmNoaWxkcmVuIHx8IFtdKVxuICAgICAgICAuZmlsdGVyKGNoaWxkRW50aXR5ID0+ICFpc0NoZWNrRGlzYWJsZWQoY2hpbGRFbnRpdHkubm9kZSkpXG4gICAgICAgIC5mb3JFYWNoKCh7IGtleSB9KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hlY2tlZCA9IGNoZWNrZWRLZXlzLmhhcyhrZXkpO1xuICAgICAgICAgIGlmIChhbGxDaGVja2VkICYmICFjaGVja2VkKSB7XG4gICAgICAgICAgICBhbGxDaGVja2VkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghcGFydGlhbENoZWNrZWQgJiYgKGNoZWNrZWQgfHwgaGFsZkNoZWNrZWRLZXlzLmhhcyhrZXkpKSkge1xuICAgICAgICAgICAgcGFydGlhbENoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgIGlmIChhbGxDaGVja2VkKSB7XG4gICAgICAgIGNoZWNrZWRLZXlzLmFkZChwYXJlbnQua2V5KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJ0aWFsQ2hlY2tlZCkge1xuICAgICAgICBoYWxmQ2hlY2tlZEtleXMuYWRkKHBhcmVudC5rZXkpO1xuICAgICAgfVxuXG4gICAgICB2aXNpdGVkS2V5cy5hZGQocGFyZW50LmtleSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNoZWNrZWRLZXlzOiBBcnJheS5mcm9tKGNoZWNrZWRLZXlzKSxcbiAgICBoYWxmQ2hlY2tlZEtleXM6IEFycmF5LmZyb20ocmVtb3ZlRnJvbUNoZWNrZWRLZXlzKGhhbGZDaGVja2VkS2V5cywgY2hlY2tlZEtleXMpKSxcbiAgfTtcbn1cblxuLy8gUmVtb3ZlIHVzZWxlc3Mga2V5XG5mdW5jdGlvbiBjbGVhbkNvbmR1Y3RDaGVjayhcbiAga2V5czogU2V0PEtleT4sXG4gIGhhbGZLZXlzOiBLZXlbXSxcbiAgbGV2ZWxFbnRpdGllczogTWFwPG51bWJlciwgU2V0PERhdGFFbnRpdHk+PixcbiAgbWF4TGV2ZWw6IG51bWJlcixcbik6IENvbmR1Y3RSZXR1cm5UeXBlIHtcbiAgY29uc3QgY2hlY2tlZEtleXMgPSBuZXcgU2V0PEtleT4oa2V5cyk7XG4gIGxldCBoYWxmQ2hlY2tlZEtleXMgPSBuZXcgU2V0PEtleT4oaGFsZktleXMpO1xuXG4gIC8vIFJlbW92ZSBjaGVja2VkIGtleXMgZnJvbSB0b3AgdG8gYm90dG9tXG4gIGZvciAobGV0IGxldmVsID0gMDsgbGV2ZWwgPD0gbWF4TGV2ZWw7IGxldmVsICs9IDEpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IGxldmVsRW50aXRpZXMuZ2V0KGxldmVsKSB8fCBuZXcgU2V0KCk7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgeyBrZXksIG5vZGUsIGNoaWxkcmVuID0gW10gfSA9IGVudGl0eTtcblxuICAgICAgaWYgKCFjaGVja2VkS2V5cy5oYXMoa2V5KSAmJiAhaGFsZkNoZWNrZWRLZXlzLmhhcyhrZXkpICYmICFpc0NoZWNrRGlzYWJsZWQobm9kZSkpIHtcbiAgICAgICAgY2hpbGRyZW5cbiAgICAgICAgICAuZmlsdGVyKGNoaWxkRW50aXR5ID0+ICFpc0NoZWNrRGlzYWJsZWQoY2hpbGRFbnRpdHkubm9kZSkpXG4gICAgICAgICAgLmZvckVhY2goY2hpbGRFbnRpdHkgPT4ge1xuICAgICAgICAgICAgY2hlY2tlZEtleXMuZGVsZXRlKGNoaWxkRW50aXR5LmtleSk7XG4gICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyBSZW1vdmUgY2hlY2tlZCBrZXlzIGZvcm0gYm90dG9tIHRvIHRvcFxuICBoYWxmQ2hlY2tlZEtleXMgPSBuZXcgU2V0PEtleT4oKTtcbiAgY29uc3QgdmlzaXRlZEtleXMgPSBuZXcgU2V0PEtleT4oKTtcbiAgZm9yIChsZXQgbGV2ZWwgPSBtYXhMZXZlbDsgbGV2ZWwgPj0gMDsgbGV2ZWwgLT0gMSkge1xuICAgIGNvbnN0IGVudGl0aWVzID0gbGV2ZWxFbnRpdGllcy5nZXQobGV2ZWwpIHx8IG5ldyBTZXQoKTtcblxuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IHsgcGFyZW50LCBub2RlIH0gPSBlbnRpdHk7XG5cbiAgICAgIC8vIFNraXAgaWYgbm8gbmVlZCB0byBjaGVja1xuICAgICAgaWYgKGlzQ2hlY2tEaXNhYmxlZChub2RlKSB8fCAhZW50aXR5LnBhcmVudCB8fCB2aXNpdGVkS2V5cy5oYXMoZW50aXR5LnBhcmVudC5rZXkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgLy8gU2tpcCBpZiBwYXJlbnQgaXMgZGlzYWJsZWRcbiAgICAgIGlmIChpc0NoZWNrRGlzYWJsZWQoZW50aXR5LnBhcmVudC5ub2RlKSkge1xuICAgICAgICB2aXNpdGVkS2V5cy5hZGQocGFyZW50LmtleSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IGFsbENoZWNrZWQgPSB0cnVlO1xuICAgICAgbGV0IHBhcnRpYWxDaGVja2VkID0gZmFsc2U7XG5cbiAgICAgIChwYXJlbnQuY2hpbGRyZW4gfHwgW10pXG4gICAgICAgIC5maWx0ZXIoY2hpbGRFbnRpdHkgPT4gIWlzQ2hlY2tEaXNhYmxlZChjaGlsZEVudGl0eS5ub2RlKSlcbiAgICAgICAgLmZvckVhY2goKHsga2V5IH0pID0+IHtcbiAgICAgICAgICBjb25zdCBjaGVja2VkID0gY2hlY2tlZEtleXMuaGFzKGtleSk7XG4gICAgICAgICAgaWYgKGFsbENoZWNrZWQgJiYgIWNoZWNrZWQpIHtcbiAgICAgICAgICAgIGFsbENoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFwYXJ0aWFsQ2hlY2tlZCAmJiAoY2hlY2tlZCB8fCBoYWxmQ2hlY2tlZEtleXMuaGFzKGtleSkpKSB7XG4gICAgICAgICAgICBwYXJ0aWFsQ2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgaWYgKCFhbGxDaGVja2VkKSB7XG4gICAgICAgIGNoZWNrZWRLZXlzLmRlbGV0ZShwYXJlbnQua2V5KTtcbiAgICAgIH1cbiAgICAgIGlmIChwYXJ0aWFsQ2hlY2tlZCkge1xuICAgICAgICBoYWxmQ2hlY2tlZEtleXMuYWRkKHBhcmVudC5rZXkpO1xuICAgICAgfVxuXG4gICAgICB2aXNpdGVkS2V5cy5hZGQocGFyZW50LmtleSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGNoZWNrZWRLZXlzOiBBcnJheS5mcm9tKGNoZWNrZWRLZXlzKSxcbiAgICBoYWxmQ2hlY2tlZEtleXM6IEFycmF5LmZyb20ocmVtb3ZlRnJvbUNoZWNrZWRLZXlzKGhhbGZDaGVja2VkS2V5cywgY2hlY2tlZEtleXMpKSxcbiAgfTtcbn1cblxuLyoqXG4gKiBDb25kdWN0IHdpdGgga2V5cy5cbiAqIEBwYXJhbSBrZXlMaXN0IGN1cnJlbnQga2V5IGxpc3RcbiAqIEBwYXJhbSBrZXlFbnRpdGllcyBrZXkgLSBkYXRhRW50aXR5IG1hcFxuICogQHBhcmFtIG1vZGUgYGZpbGxgIHRvIGZpbGwgbWlzc2luZyBrZXksIGBjbGVhbmAgdG8gcmVtb3ZlIHVzZWxlc3Mga2V5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25kdWN0Q2hlY2soXG4gIGtleUxpc3Q6IEtleVtdLFxuICBjaGVja2VkOiB0cnVlIHwgeyBjaGVja2VkOiBmYWxzZTsgaGFsZkNoZWNrZWRLZXlzOiBLZXlbXSB9LFxuICBrZXlFbnRpdGllczogUmVjb3JkPEtleSwgRGF0YUVudGl0eT4sXG4pOiBDb25kdWN0UmV0dXJuVHlwZSB7XG4gIGNvbnN0IHdhcm5pbmdNaXNzS2V5czogS2V5W10gPSBbXTtcblxuICAvLyBXZSBvbmx5IGhhbmRsZSBleGlzdCBrZXlzXG4gIGNvbnN0IGtleXMgPSBuZXcgU2V0PEtleT4oXG4gICAga2V5TGlzdC5maWx0ZXIoa2V5ID0+IHtcbiAgICAgIGNvbnN0IGhhc0VudGl0eSA9ICEha2V5RW50aXRpZXNba2V5XTtcbiAgICAgIGlmICghaGFzRW50aXR5KSB7XG4gICAgICAgIHdhcm5pbmdNaXNzS2V5cy5wdXNoKGtleSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBoYXNFbnRpdHk7XG4gICAgfSksXG4gICk7XG4gIGNvbnN0IGxldmVsRW50aXRpZXMgPSBuZXcgTWFwPG51bWJlciwgU2V0PERhdGFFbnRpdHk+PigpO1xuICBsZXQgbWF4TGV2ZWwgPSAwO1xuXG4gIC8vIENvbnZlcnQgZW50aXRpZXMgYnkgbGV2ZWwgZm9yIGNhbGN1bGF0aW9uXG4gIE9iamVjdC5rZXlzKGtleUVudGl0aWVzKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgY29uc3QgZW50aXR5ID0ga2V5RW50aXRpZXNba2V5XTtcbiAgICBjb25zdCB7IGxldmVsIH0gPSBlbnRpdHk7XG5cbiAgICBsZXQgbGV2ZWxTZXQ6IFNldDxEYXRhRW50aXR5PiA9IGxldmVsRW50aXRpZXMuZ2V0KGxldmVsKTtcbiAgICBpZiAoIWxldmVsU2V0KSB7XG4gICAgICBsZXZlbFNldCA9IG5ldyBTZXQoKTtcbiAgICAgIGxldmVsRW50aXRpZXMuc2V0KGxldmVsLCBsZXZlbFNldCk7XG4gICAgfVxuXG4gICAgbGV2ZWxTZXQuYWRkKGVudGl0eSk7XG5cbiAgICBtYXhMZXZlbCA9IE1hdGgubWF4KG1heExldmVsLCBsZXZlbCk7XG4gIH0pO1xuXG4gIHdhcm5pbmcoXG4gICAgIXdhcm5pbmdNaXNzS2V5cy5sZW5ndGgsXG4gICAgYFRyZWUgbWlzc2luZyBmb2xsb3cga2V5czogJHt3YXJuaW5nTWlzc0tleXNcbiAgICAgIC5zbGljZSgwLCAxMDApXG4gICAgICAubWFwKGtleSA9PiBgJyR7a2V5fSdgKVxuICAgICAgLmpvaW4oJywgJyl9YCxcbiAgKTtcblxuICBsZXQgcmVzdWx0OiBDb25kdWN0UmV0dXJuVHlwZTtcbiAgaWYgKGNoZWNrZWQgPT09IHRydWUpIHtcbiAgICByZXN1bHQgPSBmaWxsQ29uZHVjdENoZWNrKGtleXMsIGxldmVsRW50aXRpZXMsIG1heExldmVsKTtcbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBjbGVhbkNvbmR1Y3RDaGVjayhrZXlzLCBjaGVja2VkLmhhbGZDaGVja2VkS2V5cywgbGV2ZWxFbnRpdGllcywgbWF4TGV2ZWwpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiJdLCJ2ZXJzaW9uIjozfQ==