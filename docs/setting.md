在`albi`中，配置有两种，一种是固定的，在程序运行过程中不会变化的，如`env`, `server`等。还有一种是通过管理界面配置生成的，此类配置保存在数据库中，可以调整，程序定时更新动态生效。

## config

固定的配置信息，程序启动之后则不再发生变化，主要通过`env`的方式配置

## applicationSetting

通过管理后台配置的相关配置信息，保存在数据库中，程序定时从数据库中获取，更新配置，并能即时生效