import { searchContextDescription } from 'discourse/lib/search';
import { h } from 'virtual-dom';
import { createWidget } from 'discourse/widgets/widget';

createWidget('search-term2', {
  tagName: 'input',
  buildId: () => 'search-term',

  buildAttributes(attrs) {
    return { type: 'text',
      value: attrs.value || '',
      placeholder: attrs.contextEnabled ? "" : I18n.t('search.title') };
  },

  keyUp(e) {
    if (e.which === 13) {
      return this.sendWidgetAction('fullSearch');
    }

    const val = this.attrs.value;
    const newVal = $(`#${this.buildId()}`).val();

    if (newVal !== val) {
      this.sendWidgetAction('searchTermChanged', newVal);
    }
  }
});

createWidget('search-context2', {
  tagName: 'div.search-context',

  html(attrs) {
    const service = this.register.lookup('search-service:main');
    const ctx = service.get('searchContext');

    const result = [];
    if (ctx) {
      const description = searchContextDescription(Ember.get(ctx, 'type'),
        Ember.get(ctx, 'user.username') || Ember.get(ctx, 'category.name'));
      result.push(h('label', [
        h('input', { type: 'checkbox', checked: attrs.contextEnabled }),
        ' ',
        description
      ]));
    }

    if (!attrs.contextEnabled) {
      result.push(this.attach('link2', { href: attrs.url,
        label: 'show_help',
        className: 'show-help',
        icon: 'search',
        hideLabel: true}));
    }

    result.push(h('div.clearfix'));
    return result;
  },

  click() {
    const val = $('.search-context input').is(':checked');
    if (val !== this.attrs.contextEnabled) {
      this.sendWidgetAction('searchContextChanged', val);
    }
  }
});
