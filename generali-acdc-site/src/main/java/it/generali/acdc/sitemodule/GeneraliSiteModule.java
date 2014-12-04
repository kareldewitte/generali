package it.generali.acdc.sitemodule;

import info.magnolia.module.ModuleLifecycle;
import info.magnolia.module.ModuleLifecycleContext;

/**
 * This class is optional and represents the configuration for the generali-acdc-site module.
 * By exposing simple getter/setter/adder methods, this bean can be configured via content2bean
 * using the properties and node from <tt>config:/modules/generali-acdc-site</tt>.
 * If you don't need this, simply remove the reference to this class in the module descriptor xml.
 */
public class GeneraliSiteModule implements ModuleLifecycle{

    @Override
    public void start(ModuleLifecycleContext moduleLifecycleContext) {

    }

    @Override
    public void stop(ModuleLifecycleContext moduleLifecycleContext) {

    }
    /* you can optionally implement info.magnolia.module.ModuleLifecycle */

}
