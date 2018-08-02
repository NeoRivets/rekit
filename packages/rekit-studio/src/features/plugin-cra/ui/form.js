import React from 'react';
import _ from 'lodash';
import { Input, Checkbox, Select } from 'antd';
import store from '../../../common/store';

const Option = Select.Option;

const createSelectOptions = options => options.map(opt => <Option key={opt.value || opt.name}>{opt.name}</Option>);

const byId = id => store.getState().home.elementById[id];
const parentElement = id => byId(byId(id).parent);

const getFeatures = () =>
  byId('v:features')
    .children.map(byId)
    .map(f => ({ name: f.name, value: f.id }));

const getInitialFeature = args => {
  const { context } = args;
  if (context && context.targetId && byId(context.targetId)) {
    const targetEle = byId(context.targetId);

    if (targetEle.type === 'feature') {
      return targetEle.id;
    }
    if (/^actions|components$/.test(targetEle.type)) {
      return parentElement(targetEle.id).id;
    }
    if (/^action|component$/.test(targetEle.type)) {
      return parentElement(parentElement(targetEle.id).id).id;
    }
  }

  return '';
};

const featureMeta = args => ({
  key: 'feature',
  label: 'Feature',
  widget: Select,
  required: true,
  children: createSelectOptions(getFeatures()),
  initialValue: getInitialFeature(args),
});

const nameMeta = () => ({
  key: 'name',
  label: 'Name',
  widget: Input,
  required: true,
});

export default {
  fillMeta(args) {
    console.log('process meta: ', args);
    switch (args.formId) {
      case 'core.element.add.component':
        args.meta.elements.push(
          featureMeta(args),
          nameMeta(args),
          {
            key: 'connected',
            label: 'Connect to Store',
            widget: Checkbox,
            initialValue: false,
          },
          {
            key: 'urlPath',
            label: 'Url Path',
            widget: Input,
          }
        );

        break;
      case 'core.element.add.action':
        args.meta.elements.push(
          featureMeta(args),
          nameMeta(args),
          {
            key: 'async',
            label: 'Async',
            widget: Checkbox,
            initialValue: false,
          }
        );

        break;
      default:
        break;
    }
  },
  handleSubmit() {
    return Promise.resolve();
  },
};
