import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserProfileService } from '../../../user-profile/services/user-profile.service';
import _ from 'lodash'
import { ConfigurationsService } from '@sunbird-cb/utils-v2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatLegacyDialogRef } from '@angular/material/legacy-dialog';
@Component({
  selector: 'ws-app-custom-fields',
  templateUrl: './custom-fields.component.html',
  styleUrls: ['./custom-fields.component.scss']
})
export class CustomFieldsComponent {

  editCustomDetails = false
  customAttrList: any = []
  customAttrForm: any = {}
  customFieldValues: any = []
  customAttrListIds: any = []

  hierarchyFields: { [key: string]: string[] } = {}
  fieldOptions: { [key: string]: { [field: string]: any[] } } = {}
  masterListFormGroups: { [key: string]: FormGroup } = {}

  // For tracking which data structure to use
  useReversedData: { [key: string]: boolean } = {}

  userId: string = ''
  orgId: string = ''
  currentUser: any = {}


  constructor(private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private configService: ConfigurationsService,
    private matSnackBar: MatSnackBar,
    private dialogRef: MatLegacyDialogRef<CustomFieldsComponent>,
  ) { }

  ngOnInit() {
    this.currentUser = this.configService && this.configService.userProfile
    this.userId = this.currentUser.userId || ''
    this.orgId = this.currentUser.rootOrgId || ''
    //this.orgId = "0140788510336040962"
    this.getOrgDetails()

  }

  getOrgDetails() {
    const request = {
      request: { organisationId: this.orgId },
    }
    this.userProfileService.readOrgData(request).subscribe((res: any) => {
      this.customAttrListIds = _.get(res, 'result.response.customfieldsdata.customFieldIds', [])
      if (this.customAttrListIds && this.customAttrListIds.length) {
        this.getCustomAttributes()
      }
    }, error => {
      console.error('Error fetching organization details', error)
    })
  }

  getCustomAttributes(): void {
    let payload = {
      filterCriteriaMap: {
        organisationId: this.orgId,
        //organisationId: "0140788510336040962",
        isEnabled: true,
        customFieldId: this.customAttrListIds,
      },

      pageNumber: 0,
      pageSize: 50,
      orderDirection: "DESC",
      orderBy: 'updatedOn',
      facets: []
    }
    this.userProfileService.fetchCustomFields(payload).subscribe((res: any) => {
      this.customAttrList = _.get(res, 'result.searchResults.data', [])
      if (this.customAttrList && this.customAttrList.length > 0) {
        this.readCustomattributeDetails()
      }
    }, error => {
      console.log('Error', error)
    })

  }

  handleCancel(): void {
    this.dialogRef.close();
  }


  readCustomattributeDetails() {
    this.userProfileService.readCustomattributeDetails(this.userId, this.orgId).subscribe((res: any) => {
      this.customFieldValues = _.get(res, 'result.response.customFieldValues', [])
      this.buildDynamicForm()
      this.editCustomDetails = true
    }, error => {
      console.log('Error', error)
    })
  }

  getValue(attributeName: string) {
    const customField = this.customFieldValues.find((item: any) => item.attributeName === attributeName);
    return customField ? customField.value : '';
  }


  getListItemName(arrtName: any, listItem: any) {
    const customField = this.customFieldValues.find((_filed: any) => _filed.attributeName === arrtName)
    if (customField && customField.values && customField.values.length) {
      const _item = customField.values.find((_filed: any) => _filed.attributeName.toLocaleLowerCase() === listItem.toLocaleLowerCase())
      return _item ? _item.value : ''
    }
    return ''
  }

  getName(attributeName: string) {
    return this.customAttrList.find((item: any) => item.attributeName === attributeName)?.name || attributeName;
  }



  buildDynamicForm() {
    // Clear previous form state
    if (this.customAttrForm) {
      // Remove all controls from previous form
      Object.keys(this.masterListFormGroups).forEach(fieldName => {
        this.customAttrForm.removeControl(`${fieldName}_group`);
      });
    }

    const formControls: { [key: string]: any } = {};
    const activeFields = this.customAttrList.filter((field: any) => field.isActive);

    // Reset tracking objects
    this.hierarchyFields = {};
    this.fieldOptions = {};
    this.masterListFormGroups = {};
    this.useReversedData = {};

    activeFields.forEach((field: any) => {
      const validators = [];
      if (field.isMandatory) {
        validators.push(Validators.required);
      }
      if (field.validation) {
        validators.push(Validators.pattern(new RegExp(field.validation)));
      }

      if (field.type === 'text') {
        let value = this.getValue(field.attributeName)
        // Simple text field
        formControls[field.attributeName] = [value, validators];
      } else if (field.type === 'masterList') {
        // For masterList fields, create a nested FormGroup with controls for each level
        const nestedFormControls: { [key: string]: any } = {};

        // Determine whether to use regular or reversed data
        this.useReversedData[field.attributeName] = this.shouldUseReversedData(field);
        const dataSource = this.getDataSource(field);

        if (dataSource && dataSource.length > 0) {
          // Extract hierarchy fields (e.g., country, state, city)
          const hierarchy = this.extractHierarchyFields(dataSource, this.useReversedData[field.attributeName]);

          // Check for duplicates
          const uniqueItems = new Set(hierarchy);
          if (uniqueItems.size !== hierarchy.length) {
            console.warn(`Duplicate fields detected in hierarchy for ${field.attributeName}:`, hierarchy);
            // Remove duplicates
            this.hierarchyFields[field.attributeName] = Array.from(uniqueItems);
          } else {
            this.hierarchyFields[field.attributeName] = hierarchy;
          }

          // Initialize options map for this field
          this.fieldOptions[field.attributeName] = {};

          // Set top-level options
          if (hierarchy.length > 0) {
            const topField = hierarchy[0];
            this.fieldOptions[field.attributeName][topField] =
              this.extractOptionsForField(dataSource, topField, this.useReversedData[field.attributeName]);
          }

          let parentValues = ''
          // Create form controls for each level in the hierarchy
          hierarchy.forEach(hierarchyField => {
            const value = this.getListItemName(field.attributeName, hierarchyField)
            parentValues = parentValues ? parentValues + ',' + value : value

            // Add required validator if the field is mandatory, regardless of hierarchy level
            nestedFormControls[hierarchyField] = [value, field.isMandatory ? [Validators.required] : []];
          });

          // Create the nested form group
          const nestedGroup = this.fb.group(nestedFormControls);
          this.masterListFormGroups[field.attributeName] = nestedGroup;

          // Add a control for the main field to store combined value
          formControls[field.attributeName] = [parentValues, validators];
        } else {
          // Even for empty data, create hierarchy with at least one level
          this.hierarchyFields[field.attributeName] = ['item'];
          this.fieldOptions[field.attributeName] = { 'item': [] };

          const nestedFormControls = { 'item': ['', field.isMandatory ? [Validators.required] : []] };
          const nestedGroup = this.fb.group(nestedFormControls);
          this.masterListFormGroups[field.attributeName] = nestedGroup;

          formControls[field.attributeName] = ['', validators];
        }
      }
    });

    this.customAttrForm = this.fb.group(formControls);
    console.log('this.masterListFormGroups', this.masterListFormGroups)
    // Add the nested form groups to the main form
    Object.keys(this.masterListFormGroups).forEach(fieldName => {
      const nestedGroup = this.masterListFormGroups[fieldName];
      this.customAttrForm.addControl(`${fieldName}_group`, nestedGroup);

      // Set up change listeners for cascading dropdowns
      this.setupCascadingDropdownListeners(fieldName);
    });

    // After setting up the form and listeners
    Object.keys(this.hierarchyFields).forEach(fieldName => {
      // Load all options
      this.loadAllOptions(fieldName);
    });

    // Debug form structure
    console.log("Form controls:", Object.keys(this.customAttrForm.controls));
    // Object.keys(this.hierarchyFields).forEach(fieldName => {
    //   // console.log(`Hierarchy for ${fieldName}:`, this.hierarchyFields[fieldName]);
    //   // console.log(`Form group controls for ${fieldName}:`,
    //   //   Object.keys(this.customAttrForm.get(`${fieldName}_group`)?.controls));
    // });

    // Add to buildDynamicForm after setting up the form
    Object.keys(this.hierarchyFields).forEach(fieldName => {
      if (this.hierarchyFields[fieldName].length === 1) {
        console.log(`- ${fieldName}: ${this.hierarchyFields[fieldName][0]}`);
      }
    });


    console.log('customAttrForm', this.customAttrForm)
  }

  // Determine whether to use reversed data
  shouldUseReversedData(field: any): boolean {
    // Add null check
    if (!field) return false;

    // Check if reversedOrderCustomFieldData exists and has items
    if (field.reversedOrderCustomFieldData && field.reversedOrderCustomFieldData.length > 0) {
      return true;
    }
    return false;
  }

  // Get the appropriate data source for a field
  getDataSource(field: any): any[] {
    // Add null check
    if (!field) return [];

    if (this.shouldUseReversedData(field)) {
      return field.reversedOrderCustomFieldData || [];
    } else {
      return field.customFieldData || [];
    }
  }

  // Extract the hierarchy fields from the data structure to support 5 levels
  extractHierarchyFields(data: any[], isReversed: boolean): string[] {
    if (!data || data.length === 0) return [];

    // Use a Set to ensure uniqueness
    const hierarchySet = new Set<string>();
    const firstItem = data[0];

    if (isReversed) {
      // For reversed data (bottom-up), extract recursively
      const extractReversedFields = (item: any, currentDepth: number) => {
        if (!item || currentDepth > 5) return;

        if (item.fieldName) {
          hierarchySet.add(item.fieldName);
        }

        if (item.fieldValues && item.fieldValues.length > 0) {
          extractReversedFields(item.fieldValues[0], currentDepth + 1);

          // Also check second level of parents if it exists
          if (item.fieldValues[0].fieldValues && item.fieldValues[0].fieldValues.length > 0) {
            extractReversedFields(item.fieldValues[0].fieldValues[0], currentDepth + 2);
          }
        }
      };

      extractReversedFields(firstItem, 1);
      // Convert set to array and reverse to get correct order
      const hierarchy = Array.from(hierarchySet);
      return hierarchy.reverse();
    } else {
      // For regular data (top-down)
      const extractForwardFields = (item: any, currentDepth: number) => {
        if (!item || currentDepth > 5) return;

        if (item.fieldName) {
          hierarchySet.add(item.fieldName);
        }

        if (item.fieldValues && item.fieldValues.length > 0) {
          extractForwardFields(item.fieldValues[0], currentDepth + 1);
        }
      };

      extractForwardFields(firstItem, 1);
      return Array.from(hierarchySet);
    }
  }

  // Extract unique options for a specific field
  extractOptionsForField(data: any[], fieldName: string, isReversed: boolean): any[] {
    const uniqueOptions = new Map();

    if (isReversed) {
      // For reversed data, the top level will be the highest parent (e.g., country)
      // We need to find all unique countries by traversing up from each city
      data.forEach(item => {
        this.extractOptionsFromReversedData(item, fieldName, uniqueOptions);
      });
    } else {
      // For regular data, just extract the top-level field values
      data.forEach(item => {
        if (item.fieldName === fieldName) {
          uniqueOptions.set(item.fieldValue, {
            value: item.fieldValue,
            label: item.fieldValue,
            data: item
          });
        }
      });
    }

    return Array.from(uniqueOptions.values());
  }

  // Extract options from reversed data by traversing up the hierarchy
  extractOptionsFromReversedData(item: any, targetFieldName: string, uniqueOptions: Map<string, any>) {
    // Check if this item is the target field
    if (item.fieldName === targetFieldName) {
      uniqueOptions.set(item.fieldValue, {
        value: item.fieldValue,
        label: item.fieldValue,
        data: item
      });
      return;
    }

    // If not, check its parent fields
    if (item.fieldValues && item.fieldValues.length > 0) {
      item.fieldValues.forEach((parentItem: any) => {
        this.extractOptionsFromReversedData(parentItem, targetFieldName, uniqueOptions);

        // Also check the parent's parents
        if (parentItem.fieldValues && parentItem.fieldValues.length > 0) {
          parentItem.fieldValues.forEach((grandparentItem: any) => {
            this.extractOptionsFromReversedData(grandparentItem, targetFieldName, uniqueOptions);
          });
        }
      });
    }
  }

  // Set up listeners for cascading dropdowns (up to 5 levels)
  setupCascadingDropdownListeners(fieldName: string) {
    const hierarchy = this.hierarchyFields[fieldName];
    const formGroup = this.masterListFormGroups[fieldName];
    const isReversed = this.useReversedData[fieldName];

    if (!hierarchy || !formGroup) return;

    console.log(`Setting up cascade listeners for ${fieldName}, levels: ${hierarchy.length}`);

    // Special case for single-level dropdown
    if (hierarchy.length === 1) {
      const singleField = hierarchy[0];
      formGroup.get(singleField)?.valueChanges.subscribe(() => {
        this.updateCombinedValue(fieldName);
      });
      return;
    }

    // For each level except the last one
    for (let i = 0; i < hierarchy.length - 1; i++) {
      const parentField = hierarchy[i];
      const childField = hierarchy[i + 1];

      // Listen to changes on the parent field to update child options
      formGroup.get(parentField)?.valueChanges.subscribe(value => {
        if (value) {
          console.log(`${parentField} changed to ${value}, updating ${childField} options`);
          // Update options for the child field
          this.updateChildOptions(fieldName, parentField, value, childField, isReversed);

          // Important: Clear all fields below this one
          for (let j = i + 2; j < hierarchy.length; j++) {
            const grandchildField = hierarchy[j];
            console.log(`Clearing ${grandchildField} due to ${parentField} change`);
            formGroup.get(grandchildField)?.setValue('');
            this.fieldOptions[fieldName][grandchildField] = [];
          }
        } else {
          // Reset child field and its options
          formGroup.get(childField)?.setValue('');
          this.fieldOptions[fieldName][childField] = [];

          // Also reset all fields below this one
          for (let j = i + 2; j < hierarchy.length; j++) {
            const grandchildField = hierarchy[j];
            formGroup.get(grandchildField)?.setValue('');
            this.fieldOptions[fieldName][grandchildField] = [];
          }
        }

        // Update the combined value
        this.updateCombinedValue(fieldName);
      });
    }

    // For the last field, just update combined value when it changes
    const lastField = hierarchy[hierarchy.length - 1];
    formGroup.get(lastField)?.valueChanges.subscribe(() => {
      this.updateCombinedValue(fieldName);
    });
  }

  // Update options for a child field based on parent selection
  updateChildOptions(fieldName: string, parentField: string, parentValue: string, childField: string, isReversed: boolean) {
    const field = this.customAttrList.find((f: any) => f.attributeName === fieldName);
    if (!field) return;

    const dataSource = this.getDataSource(field);
    if (!dataSource) return;

    // Reset the child field
    const formGroup = this.masterListFormGroups[fieldName];
    formGroup.get(childField)?.setValue('');

    // Find child options based on parent selection
    const options = isReversed ?
      this.findChildOptionsFromReversedData(dataSource, parentField, parentValue, childField) :
      this.findChildOptions(dataSource, parentField, parentValue, childField);

    this.fieldOptions[fieldName][childField] = options;

    // Also reset any grandchild fields
    const hierarchy = this.hierarchyFields[fieldName];
    const childIndex = hierarchy.indexOf(childField);

    if (childIndex >= 0 && childIndex < hierarchy.length - 1) {
      const grandchildField = hierarchy[childIndex + 1];
      formGroup.get(grandchildField)?.setValue('');
      this.fieldOptions[fieldName][grandchildField] = [];
    }
  }

  // Find child options based on parent selection (for regular data)
  findChildOptions(data: any[], parentField: string, parentValue: string, childField: string): any[] {
    const options = new Map();

    // For top-level parent (e.g., country)
    data.forEach(item => {
      if (item.fieldName === parentField && item.fieldValue === parentValue && item.fieldValues) {
        // This is the parent, extract its children
        item.fieldValues.forEach((childItem: any) => {
          if (childItem.fieldName === childField) {
            options.set(childItem.fieldValue, {
              value: childItem.fieldValue,
              label: childItem.fieldValue,
              data: childItem
            });
          }
        });
      }
    });

    return Array.from(options.values());
  }

  // Find child options based on parent selection (for reversed data)
  findChildOptionsFromReversedData(data: any[], parentField: string, parentValue: string, childField: string): any[] {
    const options = new Map();

    // For reversed data, we need a different approach
    data.forEach(item => {
      // Look for items whose parent matches our criteria
      if (item.parentFieldName === parentField && item.parentFieldValue === parentValue &&
        item.fieldName === childField) {
        options.set(item.fieldValue, {
          value: item.fieldValue,
          label: item.fieldValue,
          data: item
        });
      }

      // Also search through the item's hierarchy
      if (item.fieldValues) {
        this.searchNestedItemsForChildOptions(
          item.fieldValues, parentField, parentValue, childField, options
        );
      }
    });

    return Array.from(options.values());
  }

  // Search through nested items for child options
  searchNestedItemsForChildOptions(
    items: any[],
    parentField: string,
    parentValue: string,
    childField: string,
    options: Map<string, any>
  ) {
    items.forEach(item => {
      // Check if this item is the child we're looking for
      if (item.parentFieldName === parentField &&
        item.parentFieldValue === parentValue &&
        item.fieldName === childField) {
        options.set(item.fieldValue, {
          value: item.fieldValue,
          label: item.fieldValue,
          data: item
        });
      }

      // Continue searching in nested items
      if (item.fieldValues) {
        this.searchNestedItemsForChildOptions(
          item.fieldValues, parentField, parentValue, childField, options
        );
      }
    });
  }

  // Update the combined value in the main form control
  updateCombinedValue(fieldName: string) {
    const field = this.customAttrList.find((f: any) => f.attributeName === fieldName);
    const formGroup = this.masterListFormGroups[fieldName];
    const hierarchy = this.hierarchyFields[fieldName];

    if (!field || !formGroup || !hierarchy) return;

    // Collect selected values
    const selectedValues: { [key: string]: string } = {};
    const displayValues: string[] = [];

    hierarchy.forEach(hierarchyField => {
      const value = formGroup.get(hierarchyField)?.value;
      if (value) {
        selectedValues[hierarchyField] = value;
        displayValues.push(value);
      }
    });

    // Update the main form control with combined value
    const combinedValue = displayValues.join(', ');
    this.customAttrForm.get(fieldName)?.setValue(combinedValue);

    // Store the structured data for later use
    field.selectedValues = selectedValues;
  }

  // Handle edit mode - populating existing values
  populateFormWithExistingValues() {
    // First, create a map for quick lookup
    const customFieldMap: { [attributeName: string]: any } = {};
    this.customFieldValues.forEach((item: any) => {
      customFieldMap[item.attributeName] = item;
    });

    this.customAttrList.forEach((field: any) => {
      const customField = customFieldMap[field.attributeName];

      if (!customField) {
        console.log(`No custom field value found for ${field.attributeName}`);
        return;
      }

      if (field.type === 'text') {
        // For text fields, just set the value directly
        field.value = customField.value; // Store for reference
        this.customAttrForm.get(field.attributeName)?.setValue(customField.value);

      } else if (field.type === 'masterList' && customField.values && customField.values.length > 0) {
        // For masterList fields, extract the values from the hierarchy levels
        const selectedValues: { [key: string]: string } = {};

        // Convert the array of values to a map for easier access
        const valuesByAttr: { [attributeName: string]: string } = {};
        customField.values.forEach((val: any) => {
          valuesByAttr[val.attributeName] = val.value;
        });

        // Map these to the hierarchy fields
        const hierarchy = this.hierarchyFields[field.attributeName];
        if (hierarchy) {
          hierarchy.forEach(hierarchyField => {
            if (valuesByAttr[hierarchyField]) {
              selectedValues[hierarchyField] = valuesByAttr[hierarchyField];
            }
          });

          // Store selected values on the field for later use
          field.selectedValues = selectedValues;

          // Now populate the form controls with these values
          this.populateHierarchicalValues(field);
        }
      }
    });
  }

  populateHierarchicalValues(field: any) {
    const hierarchy = this.hierarchyFields[field.attributeName];
    const formGroup = this.masterListFormGroups[field.attributeName];
    const isReversed = this.useReversedData[field.attributeName];

    if (!hierarchy || !formGroup || !field.selectedValues) {
      console.log(`Cannot populate values for ${field.attributeName}: missing data`);
      return;
    }

    // Temporarily disable ALL listeners to prevent cascade effects
    const subscriptions = this.disableValueChangeListeners(field.attributeName);

    try {
      if (hierarchy.length === 1) {
        const singleField = hierarchy[0];
        const fieldValue = field.selectedValues[singleField];

        if (fieldValue) {
          console.log(`Setting single field ${singleField} = ${fieldValue}`);
          formGroup.get(singleField)?.setValue(fieldValue, { emitEvent: false });
          this.updateCombinedValue(field.attributeName);
        }
        return;
      }

      for (let i = 0; i < hierarchy.length; i++) {
        const currentField = hierarchy[i];

        if (i === 0) {
          // Top level already has options loaded
          continue;
        }

        // For each level, we need the parent level's selected value to load options
        const parentField = hierarchy[i - 1];
        const parentValue = field.selectedValues[parentField];

        if (parentValue) {

          // Load options for this level based on parent
          this.fieldOptions[field.attributeName][currentField] = isReversed
            ? this.findChildOptionsFromReversedData(this.getDataSource(field), parentField, parentValue, currentField)
            : this.findChildOptions(this.getDataSource(field), parentField, parentValue, currentField);
        } else {
          // If no parent value, load all possible options
          console.log(`Loading all options for ${currentField} (no parent value)`);
          this.fieldOptions[field.attributeName][currentField] =
            this.extractAllOptionsForField(this.getDataSource(field), currentField, isReversed);
        }
      }

      // STEP 2: Now set values in order from parent to child
      for (let i = 0; i < hierarchy.length; i++) {
        const currentField = hierarchy[i];
        const currentValue = field.selectedValues[currentField];

        if (currentValue) {
          formGroup.get(currentField)?.setValue(currentValue, { emitEvent: false });

          // After setting value, load options for next level if needed
          if (i < hierarchy.length - 1) {
            const nextField = hierarchy[i + 1];
            this.fieldOptions[field.attributeName][nextField] = isReversed
              ? this.findChildOptionsFromReversedData(this.getDataSource(field), currentField, currentValue, nextField)
              : this.findChildOptions(this.getDataSource(field), currentField, currentValue, nextField);
          }
        }
      }

      // STEP 3: Update combined value
      this.updateCombinedValue(field.attributeName);

    } catch (error) {
      console.error('Error populating hierarchical values:', error);
    } finally {
      // Re-enable listeners
      setTimeout(() => {
        this.restoreValueChangeListeners(field.attributeName, subscriptions);
      }, 200);
    }
  }

  // Handle form submission
  handleSaveCustomForm() {
    if (this.customAttrForm.invalid) {
      // Mark all form controls as touched to show validation errors
      Object.keys(this.customAttrForm.controls).forEach(key => {
        const control = this.customAttrForm.get(key);
        if (control instanceof FormGroup) {
          Object.keys(control.controls).forEach(nestedKey => {
            control.get(nestedKey)?.markAsTouched();
          });
        } else {
          control?.markAsTouched()
        }
      })
      return
    }
    let payload: any = []
    this.customAttrList.forEach((field: any) => {
      let data: any = {
        customFieldId: field.customFieldId,
        type: field.type,
        attributeName: field.attributeName
      }
      if (field.type === 'text') {
        data['value'] = this.customAttrForm.get(field.attributeName)?.value
        payload.push(data)
      } else if (field.type === 'masterList') {
        let values: any = []
        const group = this.customAttrForm.get(`${field.attributeName}_group`) as FormGroup
        if (group && group.value) {
          field.originalCustomFieldData.forEach((item: any) => {
            if (item.name && group.value[item.name]) {
              values.push({
                attributeName: item.name,
                value: group.value[item.name],
                level: item.level || 1
              })
            }
          })
          if (values.length) {
            data['values'] = values
            payload.push(data)
          }
        }
      }
    })
    let requestPalyoud: any = {
      userId: this.userId,
      organisationId: this.orgId,
      customFieldValues: payload
    }
    this.userProfileService.updateCustomFields(requestPalyoud).subscribe((res: any) => {
      if (res && res.result && res.result.response && res.result.response === "success") {
        this.editCustomDetails = false
        this.customAttrForm.reset()
        this.getCustomAttributes()
        this.dialogRef.close(true)
        this.matSnackBar.open("Custom fields saved successfully")
      }
    }, error => {
      this.matSnackBar.open(error.error.params.errMsg)
      this.dialogRef.close(true)
      console.error('Error saving custom fields:', error.error.params.errMsg);
    })
  }

  // Update handleEditCustomDetails to build the form and populate values
  handleEditCustomDetails() {
    this.editCustomDetails = true
    this.buildDynamicForm();
    this.customAttrList.forEach((field: any) => {
      if (field.type === 'masterList') {
        field.selectedValues = {}; // Reset any previously stored values
      } else {
        field.value = ''; // Reset text field values
      }
    });
    this.populateFormWithExistingValues()
  }

  // Add this method to handle dropdown changes
  onDropdownChange(fieldName: string, hierarchyField: string, value: string, index: number) {
    if (!value) return;

    const hierarchy = this.hierarchyFields[fieldName];
    const isLastField = index === hierarchy.length - 1;

    console.log(`Dropdown changed: ${fieldName}, field: ${hierarchyField}, value: ${value}, index: ${index}, isLast: ${isLastField}`);

    // If this is the last field in the hierarchy (e.g., city),
    // we need to try to set parent values (e.g., state, country)
    if (isLastField) {
      console.log('Last field selected, trying to set parent values');
      this.setParentValuesFromChild(fieldName, hierarchyField, value);
    }
  }

  // Method to set parent values when a child is selected
  setParentValuesFromChild(fieldName: string, childField: string, childValue: string) {
    console.log(`Setting parent values for ${fieldName}, child: ${childField}, value: ${childValue}`);

    // Find the field by attributeName
    const field = this.customAttrList.find((f: any) => f.attributeName === fieldName);
    if (!field) {
      console.log('Field not found');
      return;
    }

    const dataSource = this.getDataSource(field);
    if (!dataSource) {
      console.log('Data source not found');
      return;
    }

    const hierarchy = this.hierarchyFields[fieldName];
    const formGroup = this.masterListFormGroups[fieldName];
    const isReversed = this.useReversedData[fieldName];

    console.log(`Hierarchy: ${JSON.stringify(hierarchy)}, isReversed: ${isReversed}`);

    // Find the selected child item in the data source
    const childItem = this.findItemByFieldAndValue(dataSource, childField, childValue, isReversed);

    if (!childItem) {
      console.log('Child item not found in data source');
      return;
    }

    console.log('Found child item:', childItem);

    // Make sure the childItem has the attributeName set
    childItem.attributeName = fieldName;

    // Now try to set parent values by traversing up the hierarchy
    const parentValues = this.findParentValues(childItem, hierarchy, childField, isReversed, field);

    console.log('Parent values found:', parentValues);

    if (Object.keys(parentValues).length === 0) {
      this.customAttrForm.get(childItem.fieldAttribute)?.setValue(childValue);
      return;
    }

    // Important: Store current values to restore if necessary
    const savedValues: { [key: string]: string } = {};
    hierarchy.forEach(field => {
      savedValues[field] = formGroup.get(field)?.value;
    });
    savedValues[childField] = childValue; // Ensure we keep the selected child value

    // Temporarily disable ALL valueChanges subscriptions to prevent cascade effects
    const subscriptions = this.disableValueChangeListeners(fieldName);

    try {
      // Set parent values in the form group - set them in reverse order (from parent to child)
      // to avoid child options being reset
      const sortedParentFields = Object.keys(parentValues).sort((a, b) => {
        return hierarchy.indexOf(a) - hierarchy.indexOf(b);
      });

      // First set the top-level parents
      sortedParentFields.forEach(parentField => {
        console.log(`Setting ${parentField} = ${parentValues[parentField]}`);
        formGroup.get(parentField)?.setValue(parentValues[parentField], { emitEvent: false });
      });

      // Now make sure the child field still has its value
      formGroup.get(childField)?.setValue(childValue, { emitEvent: false });

      // Update the combined value
      this.updateCombinedValue(fieldName);

    } catch (error) {
      console.error('Error setting parent values:', error);
      // Restore saved values if something goes wrong
      Object.keys(savedValues).forEach(field => {
        if (savedValues[field]) {
          formGroup.get(field)?.setValue(savedValues[field], { emitEvent: false });
        }
      });
    } finally {
      // Re-enable the value change listeners with the subscriptions we saved
      this.restoreValueChangeListeners(fieldName, subscriptions);
    }
  }

  // Find an item in the data source by field name and value
  findItemByFieldAndValue(data: any[], fieldName: string, fieldValue: string, isReversed: boolean): any {
    if (!data) return null;


    // Try to find a direct match
    const directMatch = data.find(item =>
      item.fieldName === fieldName && item.fieldValue === fieldValue
    );

    if (directMatch) {
      // Ensure the item has all necessary properties
      if (!directMatch.attributeName) {
        // Try to determine the attributeName from context
        for (const field of this.customAttrList) {
          if (field.type === 'masterList' &&
            (field.customFieldData === data || field.reversedOrderCustomFieldData === data)) {
            directMatch.attributeName = field.attributeName;
            break;
          }
        }
      }
      return directMatch;
    }

    // If not found, search recursively
    for (const item of data) {
      if (item.fieldValues && item.fieldValues.length > 0) {
        const nestedMatch = this.findItemByFieldAndValue(
          item.fieldValues, fieldName, fieldValue, isReversed
        );
        if (nestedMatch) return nestedMatch;
      }
    }

    return null;
  }

  // Find parent values from a child item (up to 5 levels)
  findParentValues(item: any, hierarchy: string[], childField: string, isReversed: boolean, field: any): any {
    const parentValues: { [key: string]: string } = {};

    console.log('Finding parent values for item:', item, childField);

    if (isReversed) {
      // For reversed data structure
      const traverseParents = (currentItem: any) => {
        if (!currentItem || Object.keys(parentValues).length >= 4) return; // Max 4 parents for 5 levels

        if (currentItem.parentFieldName && currentItem.parentFieldValue) {
          // Only add if it's in our hierarchy
          if (hierarchy.includes(currentItem.parentFieldName)) {
            console.log(`Found parent: ${currentItem.parentFieldName} = ${currentItem.parentFieldValue}`);
            parentValues[currentItem.parentFieldName] = currentItem.parentFieldValue;

            // Look for this parent to find its parent
            const dataSource = this.getDataSource(field);
            const parentItem = this.findItemByNameAndValueInData(
              currentItem.parentFieldName,
              currentItem.parentFieldValue,
              dataSource
            );

            // Continue traversing up
            if (parentItem) {
              traverseParents(parentItem);
            }
          }
        }
      };

      traverseParents(item);

    } else {
      // For regular data structure
      const traverseUp = (currentItem: any, depth: number = 0) => {
        if (!currentItem || depth > 4) return; // Max 4 parents for 5 levels

        if (currentItem.parentFieldName && currentItem.parentFieldValue) {
          // Only add if it's in our hierarchy
          if (hierarchy.includes(currentItem.parentFieldName)) {
            console.log(`Found parent: ${currentItem.parentFieldName} = ${currentItem.parentFieldValue}`);
            parentValues[currentItem.parentFieldName] = currentItem.parentFieldValue;

            // Find this parent to find grandparent
            const dataSource = this.getDataSource(field);
            const parentItem = this.findItemByNameAndValueInData(
              currentItem.parentFieldName,
              currentItem.parentFieldValue,
              dataSource
            );

            // Continue traversing up
            if (parentItem) {
              traverseUp(parentItem, depth + 1);
            }
          }
        }
      };

      traverseUp(item);
    }

    return parentValues;
  }

  // Helper to find an item by name and value in a data source
  findItemByNameAndValueInData(fieldName: string, fieldValue: string, data: any[]): any {
    if (!data) return null;

    for (const item of data) {
      if (item.fieldName === fieldName && item.fieldValue === fieldValue) {
        return item;
      }

      if (item.fieldValues && item.fieldValues.length > 0) {
        const found = this.findItemByNameAndValueInData(fieldName, fieldValue, item.fieldValues);
        if (found) return found;
      }
    }

    return null;
  }

  // Temporarily disable value change listeners
  disableValueChangeListeners(fieldName: string): any {
    const hierarchy = this.hierarchyFields[fieldName];
    if (!hierarchy) return {};

    const savedSubscriptions: any = {};

    // If we have setup listeners before, we need to reset them
    const formGroup = this.masterListFormGroups[fieldName];
    if (formGroup) {
      hierarchy.forEach(hierarchyField => {
        const control = formGroup.get(hierarchyField);
        if (control) {
          // Save any existing subscriptions
          // @ts-ignore: We need to access private members
          if (control._valueChanges && control._valueChanges.observers) {
            // @ts-ignore: Property '_valueChanges' is private
            savedSubscriptions[hierarchyField] = [...control._valueChanges.observers];
            // @ts-ignore: Property '_valueChanges' is private
            control._valueChanges.observers = [];
          }
        }
      });
    }

    return savedSubscriptions;
  }

  // Add this method to load all options for all fields
  loadAllOptions(fieldName: string) {
    const field = this.customAttrList.find((f: any) => f.attributeName === fieldName);
    if (!field) return;

    const dataSource = this.getDataSource(field);
    if (!dataSource) return;

    const hierarchy = this.hierarchyFields[fieldName];
    const isReversed = this.useReversedData[fieldName];

    // First level is already loaded in this.extractOptionsForField

    // Load options for all other levels
    hierarchy.forEach((hierarchyField, index) => {
      if (index === 0) return; // Skip first level, it's already loaded

      // Load all possible options for this field
      this.fieldOptions[fieldName][hierarchyField] = this.extractAllOptionsForField(
        dataSource, hierarchyField, isReversed
      );
    });
  }

  // Extract all possible options for a field regardless of parent selection
  extractAllOptionsForField(data: any[], fieldName: string, isReversed: boolean = false): any[] {
    const uniqueOptions = new Map();

    if (isReversed) {
      // For reversed data, we need to handle differently
      data.forEach(item => {
        this.extractOptionsFromReversedData(item, fieldName, uniqueOptions);
      });
    } else {
      // Helper function to extract options recursively for standard data
      const extractRecursively = (items: any[]) => {
        items.forEach(item => {
          if (item.fieldName === fieldName) {
            uniqueOptions.set(item.fieldValue, {
              value: item.fieldValue,
              label: item.fieldValue,
              data: item
            });
          }

          // Also check in fieldValues
          if (item.fieldValues && item.fieldValues.length > 0) {
            extractRecursively(item.fieldValues);
          }
        });
      };

      extractRecursively(data);
    }

    return Array.from(uniqueOptions.values());
  }

  // Restore value change listeners with saved subscriptions
  restoreValueChangeListeners(fieldName: string, savedSubscriptions: any) {
    // We'll just re-setup all listeners from scratch
    console.log(`Restoring value change listeners for ${savedSubscriptions}`);
    setTimeout(() => {
      this.setupCascadingDropdownListeners(fieldName);
    }, 100);
  }

  // Helper to log nested data structure
  logDataStructure(item: any, depth: number, isReversed: boolean) {
    const indent = '  '.repeat(depth);
    console.log(`${indent}Field: ${item.fieldName}, Value: ${item.fieldValue}`);

    if (item.parentFieldName) {
      console.log(`${indent}Parent: ${item.parentFieldName} = ${item.parentFieldValue}`);
    }

    if (item.fieldValues && item.fieldValues.length > 0) {
      console.log(`${indent}Children:`);
      item.fieldValues.forEach((child: any) => {
        this.logDataStructure(child, depth + 1, isReversed);
      });
    }
  }

  // Debug helper to log the current state of the form
  logFormValues(fieldName: string) {
    const hierarchy = this.hierarchyFields[fieldName];
    const formGroup = this.masterListFormGroups[fieldName];

    if (!hierarchy || !formGroup) return;

    console.log(`==== Form Values for ${fieldName} ====`);
    hierarchy.forEach(field => {
      const value = formGroup.get(field)?.value;
      console.log(`${field}: ${value || 'not set'}`);

      // Log available options
      const options = this.fieldOptions[fieldName][field];
      console.log(`  Options (${options?.length || 0}): ${options?.map(o => o.value).join(', ') || 'none'}`);
    });
    console.log('============================');
  }

  // Pre-load all possible options for all levels before setting values
  preloadAllLevelOptions(fieldName: string) {
    const field = this.customAttrList.find((f: any) => f.attributeName === fieldName);
    if (!field) return;

    const dataSource = this.getDataSource(field);
    if (!dataSource || !dataSource.length) return;

    const hierarchy = this.hierarchyFields[fieldName];
    const isReversed = this.useReversedData[fieldName];

    // For each level in the hierarchy
    hierarchy.forEach((hierarchyField, index) => {
      if (index === 0) {
        // First level already has options loaded in buildDynamicForm
        return;
      }

      console.log(`Pre-loading all options for ${fieldName} > ${hierarchyField}`);

      // Extract all possible options for this field
      this.fieldOptions[fieldName][hierarchyField] =
        this.extractAllOptionsForField(dataSource, hierarchyField, isReversed);
    });
  }
}
