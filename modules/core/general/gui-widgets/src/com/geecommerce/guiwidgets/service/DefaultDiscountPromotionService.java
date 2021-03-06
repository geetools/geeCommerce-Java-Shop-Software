package com.geecommerce.guiwidgets.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.geecommerce.core.service.annotation.Service;
import com.geecommerce.core.type.Id;
import com.geecommerce.guiwidgets.model.DiscountPromotion;
import com.geecommerce.guiwidgets.repository.DiscountPromotions;
import com.google.inject.Inject;

@Service
public class DefaultDiscountPromotionService implements DiscountPromotionService {
    private final DiscountPromotions discountPromotions;

    @Inject
    public DefaultDiscountPromotionService(DiscountPromotions discountPromotions) {
        this.discountPromotions = discountPromotions;
    }

    @Override
    public List<DiscountPromotion> getDiscountPromotionByKey(String key) {
        Map<String, Object> filter = new HashMap<>();
        filter.put(DiscountPromotion.Col.KEY, key);
        return discountPromotions.find(DiscountPromotion.class, filter);
    }

    @Override
    public DiscountPromotion getDiscountPromotion(Id id) {
        return discountPromotions.findById(DiscountPromotion.class, id);
    }

}
