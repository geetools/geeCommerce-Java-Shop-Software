package com.geecommerce.guiwidgets.service;

import java.util.List;

import com.geecommerce.core.service.api.Service;
import com.geecommerce.guiwidgets.model.WebSlideShow;

public interface WebSlideShowService extends Service {
    public WebSlideShow createWebSlideShow(WebSlideShow webSlideShow);

    public List<WebSlideShow> getWebSlideShowByName(String name);

    public void update(WebSlideShow webSlideShow);

}
