$KCODE = 'UTF8'
require "merb-assets"

Merb.flat! do |url|
  url.match('/').to(:controller => 'simple', :action =>'index')
end

class Simple < Merb::Controller
  provides :json
  self._template_root = Dir.pwd
  
  def index
    render :index
  end
  
  def list
    display(:array => %w(One Two Three Four))
  end
end